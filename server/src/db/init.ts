import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
    const client = await pool.connect();
    try {
        console.log('Creating tables...');

        // Calculations Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS calculations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                study_code VARCHAR NOT NULL,
                chart_name VARCHAR NOT NULL,
                parameters JSONB NOT NULL,
                computed JSONB NOT NULL,
                status VARCHAR NOT NULL DEFAULT 'complete',
                created_by UUID NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                metadata JSONB NULL
            );
        `);

        // Audit Logs Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NULL,
                action VARCHAR NOT NULL,
                entity VARCHAR NOT NULL,
                entity_id UUID NOT NULL,
                details JSONB,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        client.release();
        await pool.end();
    }
};

createTables();
