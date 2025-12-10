import { Request, Response } from 'express';
import { calculatorService, ChartType } from '../services/calculator/CalculatorService';
import { CalculationParameters } from '../services/calculator/CalculatorAdapter';
import { pool } from '../index';



export const createCalculation = async (req: Request, res: Response) => {
    try {
        const { study_code, chart, parameters, status } = req.body;

        if (!study_code || !chart || !parameters) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Run Calculation
        const executedParams: CalculationParameters = parameters;
        const result = calculatorService.calculate(chart as ChartType, executedParams);

        // Prepare Record
        const record = {
            id: crypto.randomUUID(),
            study_code,
            chart_name: chart,
            parameters: executedParams,
            computed: result,
            status: status || 'complete',
            created_at: new Date().toISOString(),
            created_by: null
        };

        // Try Persist to DB
        const query = `
            INSERT INTO calculations (id, study_code, chart_name, parameters, computed, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;
        await pool.query(query, [
            record.id,
            study_code,
            chart,
            JSON.stringify(parameters),
            JSON.stringify(result),
            status || 'complete',
            record.created_at
        ]);

        return res.status(201).json({
            ...record,
            db_saved: true
        });

    } catch (error) {
        console.error("Calculation Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCalculation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM calculations WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Database Error', details: error });
    }
};

export const listCalculations = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM calculations ORDER BY created_at DESC LIMIT 50');
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: 'Database Error', details: error });
    }
};

export const exportCalculations = async (req: Request, res: Response) => {
    let rows: any[] = [];
    try {
        const result = await pool.query('SELECT * FROM calculations ORDER BY created_at DESC');
        rows = result.rows;
    } catch (error) {
        return res.status(500).json({ error: 'Database Error', details: error });
    }

    // CSV Header
    let csv = "Study Code,Chart,Date,Status,Age,Sex,SBP,Smoking,Diabetes,Cholesterol,Risk Level,Risk %\n";

    rows.forEach(r => {
        // Handle potential stringified JSON from DB versus object from localStore
        const p = typeof r.parameters === 'string' ? JSON.parse(r.parameters) : r.parameters;
        const c = typeof r.computed === 'string' ? JSON.parse(r.computed) : r.computed;

        const line = [
            r.study_code,
            r.chart_name,
            new Date(r.created_at).toLocaleDateString(),
            r.status,
            p.age,
            p.sex,
            p.sbp,
            p.smoking,
            p.diabetes,
            p.tc ? `${p.tc} ${p.tc_unit}` : 'N/A',
            c.category,
            c.riskPercent
        ].map(v => `"${v ?? ''}"`).join(',');
        csv += line + "\n";
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`ubimed-risk-data-${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
};
