import express from 'express';
import {
  updateLocation,
  getCurrentLocation,
  getActiveRentals,
  getLocationHistory
} from '../controllers/trackingController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/update', authenticateToken, updateLocation);
router.get('/car/:carId', authenticateToken, getCurrentLocation);
router.get('/active-rentals', authenticateToken, isAdmin, getActiveRentals);
router.get('/history/:reservationId', authenticateToken, getLocationHistory);

export default router;