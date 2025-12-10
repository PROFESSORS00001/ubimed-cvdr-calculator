import { Router } from 'express';
import { createCalculation, getCalculation, listCalculations } from '../controllers/CalculationController';

const router = Router();

router.post('/', createCalculation);
router.get('/:id', getCalculation);
router.get('/', listCalculations);

export default router;
