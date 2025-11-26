import express from 'express';
import {
  getAllMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance
} from '../controllers/maintenanceController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.get('/', authenticateToken, requireAdmin, getAllMaintenances);
router.get('/:id', authenticateToken, requireAdmin, getMaintenanceById);
router.post('/', authenticateToken, requireAdmin, createMaintenance);
router.put('/:id', authenticateToken, requireAdmin, updateMaintenance);
router.patch('/:id/status', authenticateToken, requireAdmin, updateMaintenanceStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteMaintenance);

export default router;
