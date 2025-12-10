export interface CalculationParameters {
    age: number | '';
    sex: 'Male' | 'Female';
    sbp: number | '';
    dbp?: number | '';
    diabetes: 'Yes' | 'No';
    smoking: 'Yes' | 'No';
    tc?: number | '';
    tc_unit?: 'mmol/L' | 'mg/dL';
    hdl?: number | '';
    hdl_unit?: 'mmol/L' | 'mg/dL';
    treatment?: 'Yes' | 'No';
    region?: string;
}

export interface CalculationRecord {
    id: string;
    study_code: string;
    chart_name: string;
    parameters: CalculationParameters;
    computed: any; // specific structure defined in backend
    status: 'draft' | 'complete';
    created_at: string;
}
