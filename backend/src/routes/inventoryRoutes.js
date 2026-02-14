import express from 'express';
import {
    getInventoryLogs,
    adjustInventory,
    getInventoryValue
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getInventoryLogs);
router.post('/adjust', protect, authorize('admin', 'almacenista'), adjustInventory);
router.get('/value', protect, getInventoryValue);

export default router;
