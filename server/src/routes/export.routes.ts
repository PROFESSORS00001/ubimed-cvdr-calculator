import { Router } from 'express';
import { exportCalculations } from '../controllers/CalculationController';

const router = Router();

router.get('/', exportCalculations);

export default router;
