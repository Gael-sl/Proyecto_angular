import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import db from '../config/db';

interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  rating: number;
  totalRentals: number;
  createdAt: string;
}

// Generar JWT
const generateToken = (userId: number, email: string, role: string): string => {
  const secret: Secret = (process.env.JWT_SECRET || 'default_secret') as Secret;
  const expiresIn: string | number = process.env.JWT_EXPIRES_IN || '7d';
  const options: SignOptions = { expiresIn: expiresIn as unknown as any };

  return jwt.sign(
    { userId, email, role },
    secret,
    options
  );
};

// REGISTRO
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validaciones
    if (!email || !password || !firstName || !lastName || !phone) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      res.status(400).json({ message: 'El email ya está registrado' });
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = db.prepare(`
      INSERT INTO users (email, password, firstName, lastName, phone, role)
      VALUES (?, ?, ?, ?, ?, 'user')
    `).run(email, hashedPassword, firstName, lastName, phone);

    const userId = result.lastInsertRowid as number;

    // Obtener usuario creado
    const newUser = db.prepare(`
      SELECT id, email, firstName, lastName, phone, role, rating, totalRentals, createdAt
      FROM users WHERE id = ?
    `).get(userId) as Omit<User, 'password'>;

    // Generar token
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son requeridos' });
      return;
    }

    // Buscar usuario
    const user = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email) as User | undefined;

    if (!user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Generar token
    const token = generateToken(user.id, user.email, user.role);

    // Remover password de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// OBTENER PERFIL (Ruta protegida)
export const getProfile = (req: Request, res: Response): void => {
  try {
    const userId = req.userId;

    const user = db.prepare(`
      SELECT id, email, firstName, lastName, phone, role, rating, totalRentals, createdAt
      FROM users WHERE id = ?
    `).get(userId);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

// VERIFICAR TOKEN
export const verifyToken = (req: Request, res: Response): void => {
  // Si llegamos aquí, el token es válido (pasó por el middleware)
  res.json({ valid: true, userId: req.userId, role: req.userRole });
};

// ACTUALIZAR PERFIL
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName || !phone) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }

    db.prepare(`
      UPDATE users 
      SET firstName = ?, lastName = ?, phone = ?
      WHERE id = ?
    `).run(firstName, lastName, phone, userId);

    const updatedUser = db.prepare(`
      SELECT id, email, firstName, lastName, phone, role, rating, totalRentals, createdAt
      FROM users WHERE id = ?
    `).get(userId);

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// CAMBIAR CONTRASEÑA
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Se requieren ambas contraseñas' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Obtener usuario
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(userId) as { password: string } | undefined;

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Contraseña actual incorrecta' });
      return;
    }

    // Hash de nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, userId);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};