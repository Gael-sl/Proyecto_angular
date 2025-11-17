import express from 'express';
import {
  register,
  login,
  getProfile,
  verifyToken,
  updateProfile,
  changePassword
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProfile);
router.get('/verify', authenticateToken, verifyToken);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

export default router;