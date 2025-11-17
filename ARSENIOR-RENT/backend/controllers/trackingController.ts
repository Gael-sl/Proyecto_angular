import { Request, Response } from 'express';
import db from '../config/db';

// ACTUALIZAR UBICACIÓN GPS
export const updateLocation = (req: Request, res: Response): void => {
  try {
    const {
      reservationId,
      latitude,
      longitude,
      speed,
      heading,
      accuracy
    } = req.body;

    if (!reservationId || latitude === undefined || longitude === undefined) {
      res.status(400).json({ message: 'Faltan parámetros requeridos' });
      return;
    }

    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(reservationId) as any;
    if (!reservation) {
      res.status(404).json({ message: 'Reserva no encontrada' });
      return;
    }

    if (reservation.status !== 'activa') {
      res.status(400).json({ message: 'Solo se puede actualizar ubicación de reservas activas' });
      return;
    }

    const result = db.prepare(`
      INSERT INTO vehicle_locations (
        carId, reservationId, latitude, longitude, speed, heading, accuracy, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      reservation.carId,
      reservationId,
      latitude,
      longitude,
      speed || null,
      heading || null,
      accuracy || null
    );

    const location = db.prepare('SELECT * FROM vehicle_locations WHERE id = ?').get(result.lastInsertRowid);

    res.json({
      message: 'Ubicación actualizada exitosamente',
      location
    });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ message: 'Error al actualizar ubicación' });
  }
};

// OBTENER UBICACIÓN ACTUAL DE UN VEHÍCULO
export const getCurrentLocation = (req: Request, res: Response): void => {
  try {
    const { carId } = req.params;

    const location = db.prepare(`
      SELECT * FROM vehicle_locations
      WHERE carId = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `).get(carId);

    if (!location) {
      res.status(404).json({ message: 'No se encontró ubicación para este vehículo' });
      return;
    }

    res.json(location);
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    res.status(500).json({ message: 'Error al obtener ubicación' });
  }
};

// ADMIN: OBTENER TODAS LAS RENTAS ACTIVAS CON UBICACIONES
export const getActiveRentals = (req: Request, res: Response): void => {
  try {
    const activeReservations = db.prepare(`
      SELECT 
        r.*,
        c.id as carId, c.brand, c.model, c.image, c.licensePlate,
        u.id as userId, u.firstName, u.lastName, u.email, u.phone
      FROM reservations r
      JOIN cars c ON r.carId = c.id
      JOIN users u ON r.userId = u.id
      WHERE r.status = 'activa'
    `).all() as any[];

    const rentalsWithLocations = activeReservations.map(reservation => {
      // Obtener última ubicación
      const location = db.prepare(`
        SELECT * FROM vehicle_locations
        WHERE reservationId = ?
        ORDER BY timestamp DESC
        LIMIT 1
      `).get(reservation.id);

      return {
        reservation: {
          id: reservation.id,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          plan: reservation.plan,
          status: reservation.status
        },
        car: {
          id: reservation.carId,
          brand: reservation.brand,
          model: reservation.model,
          image: reservation.image,
          licensePlate: reservation.licensePlate
        },
        user: {
          id: reservation.userId,
          firstName: reservation.firstName,
          lastName: reservation.lastName,
          email: reservation.email,
          phone: reservation.phone
        },
        currentLocation: location || null,
        lastUpdate: location ? (location as any).timestamp : null
      };
    });

    res.json(rentalsWithLocations);
  } catch (error) {
    console.error('Error al obtener rentas activas:', error);
    res.status(500).json({ message: 'Error al obtener rentas activas' });
  }
};

// OBTENER HISTORIAL DE UBICACIONES DE UNA RESERVA
export const getLocationHistory = (req: Request, res: Response): void => {
  try {
    const { reservationId } = req.params;

    const locations = db.prepare(`
      SELECT * FROM vehicle_locations
      WHERE reservationId = ?
      ORDER BY timestamp DESC
    `).all(reservationId);

    res.json(locations);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener historial de ubicaciones' });
  }
};