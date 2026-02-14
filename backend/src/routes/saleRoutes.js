import express from 'express';
import {
    getSales,
    getSaleById,
    createSale,
    getTodaySales
} from '../controllers/saleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getSales)
    .post(protect, createSale);

router.get('/today/summary', protect, getTodaySales);

router.route('/:id')
    .get(protect, getSaleById);

export default router;
