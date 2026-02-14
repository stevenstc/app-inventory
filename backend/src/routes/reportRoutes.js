import express from 'express';
import {
    getSalesReport,
    getInventoryReport,
    getDashboardStats
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/sales', protect, getSalesReport);
router.get('/inventory', protect, getInventoryReport);
router.get('/dashboard', protect, getDashboardStats);

export default router;
