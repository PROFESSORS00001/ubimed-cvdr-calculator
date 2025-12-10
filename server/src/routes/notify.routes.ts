import { Router } from 'express';
import { sendEmailReport } from '../controllers/NotificationController';

const router = Router();

router.post('/email', sendEmailReport);

export default router;
