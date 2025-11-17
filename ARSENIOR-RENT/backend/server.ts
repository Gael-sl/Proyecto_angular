import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, seedDatabase } from './config/db';

// Importar TODAS las rutas
import authRoutes from './routes/auth';
import carsRoutes from './routes/cars';
import reservationsRoutes from './routes/reservations';
import checklistsRoutes from './routes/checklists';
import ratingsRoutes from './routes/ratings';
import trackingRoutes from './routes/tracking';
import adminRoutes from './routes/admin';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumentar límite para fotos en base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (opcional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Inicializar base de datos
initDatabase();
seedDatabase();

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Arsenior Rent API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      cars: '/api/cars',
      reservations: '/api/reservations',
      checklists: '/api/checklists',
      ratings: '/api/ratings',
      tracking: '/api/tracking',
      admin: '/api/admin'
    }
  });
});

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/checklists', checklistsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejo de errores global
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║        🚗 ARSENIOR RENT API v1.0.0 🚗         ║
║                                                ║
║   ✅ Servidor corriendo en puerto ${PORT}         ║
║   🗄️  Base de datos SQLite inicializada        ║
║   📡 Endpoint: http://localhost:${PORT}          ║
║                                                ║
║   📚 ENDPOINTS DISPONIBLES:                    ║
║   ├─ /api/auth          (Autenticación)       ║
║   ├─ /api/cars          (Vehículos)           ║
║   ├─ /api/reservations  (Reservas)            ║
║   ├─ /api/checklists    (Listas de Cotejo)    ║
║   ├─ /api/ratings       (Calificaciones)      ║
║   ├─ /api/tracking      (GPS Tracking)        ║
║   └─ /api/admin         (Panel Admin)         ║
║                                                ║
║   🔐 Usuarios de prueba:                       ║
║   Admin: admin@arseniorrent.com / admin123    ║
║   User:  user@test.com / user123              ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

export default app;