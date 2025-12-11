import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
}));
app.use(express.json());

// Database Pool
const isProduction = process.env.NODE_ENV === 'production';
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : undefined
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root Route (Welcome Message)
app.get('/', (req: Request, res: Response) => {
    res.send('UBIMED CVDR Calculator API is running successfully. 🚀');
});



import calculationRoutes from './routes/calculation.routes';
import exportRoutes from './routes/export.routes';
import resourceRoutes from './routes/resources.routes';

import notifyRoutes from './routes/notify.routes';

// API Routes
app.use('/api/calculation', calculationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notify', notifyRoutes);

app.use('/assets', express.static('public')); // Serve static assets if needed



app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
