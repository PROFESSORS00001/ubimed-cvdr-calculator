export interface CalculationParameters {
    age: number;
    sex: 'Male' | 'Female';
    sbp: number;
    dbp?: number;
    diabetes: 'Yes' | 'No';
    smoking: 'Yes' | 'No';
    tc?: number; // Total Cholesterol value
    tc_unit?: 'mmol/L' | 'mg/dL';
    hdl?: number;
    hdl_unit?: 'mmol/L' | 'mg/dL';
    treatment?: 'Yes' | 'No'; // Antihypertensive
    region?: string; // For WHO/ISH chart selection (e.g., AFR-D)
}

export interface CalculationResult {
    riskPercent: number | string; // string for ranges like "<10%"
    category: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extremely High';
    breakdown: Array<{
        parameter: string;
        value: string | number;
        contribution: string; // e.g. "Mapped to band 50-59" or "Points: 5"
    }>;
    notes?: string[];
}

export interface CalculatorAdapter {
    calculate(params: CalculationParameters): CalculationResult;
}
