import { CalculatorAdapter, CalculationParameters, CalculationResult } from './CalculatorAdapter';

export class FraminghamAdapter implements CalculatorAdapter {
    calculate(params: CalculationParameters): CalculationResult {
        const { age, sex, sbp, smoking, diabetes, tc, tc_unit, hdl, hdl_unit } = params;

        // Framingham Point Scores (Simplified for Prototype based on 2008 General CVD)

        let points = 0;
        const breakdown: CalculationResult['breakdown'] = [];

        // 1. Age Points
        let agePoints = 0;
        if (sex === 'Male') {
            if (age < 35) agePoints = 0;
            else if (age < 40) agePoints = 2;
            else if (age < 45) agePoints = 5;
            else if (age < 50) agePoints = 6;
            else if (age < 55) agePoints = 8;
            else if (age < 60) agePoints = 10;
            else if (age < 65) agePoints = 11;
            else if (age < 70) agePoints = 12;
            else if (age < 75) agePoints = 14;
            else agePoints = 15;
        } else {
            if (age < 35) agePoints = 0;
            else if (age < 40) agePoints = 2;
            else if (age < 45) agePoints = 4;
            else if (age < 50) agePoints = 5;
            else if (age < 55) agePoints = 7;
            else if (age < 60) agePoints = 8;
            else if (age < 65) agePoints = 9;
            else if (age < 70) agePoints = 10;
            else if (age < 75) agePoints = 11;
            else agePoints = 12;
        }
        points += agePoints;
        breakdown.push({ parameter: "Age", value: age, contribution: `${agePoints} points` });

        // 2. TC Points
        let tcVal = tc || 0;
        if (tc_unit === 'mmol/L') {
            tcVal = tcVal * 38.67; // Convert to mg/dL for typical Framingham tables
        }
        let tcPoints = 0;
        // Simplified Logic: +1 point for every 40mg/dL over 160
        if (tcVal >= 280) tcPoints = 3;
        else if (tcVal >= 240) tcPoints = 2;
        else if (tcVal >= 200) tcPoints = 1;
        points += tcPoints;
        breakdown.push({ parameter: "Total Cholesterol", value: tcVal.toFixed(0) + " mg/dL", contribution: `${tcPoints} points` });

        // 3. Smoking Points
        let smokePoints = 0;
        if (smoking === 'Yes') {
            smokePoints = sex === 'Male' ? 4 : 3;
        }
        points += smokePoints;
        breakdown.push({ parameter: "Smoking", value: smoking, contribution: `${smokePoints} points` });

        // 4. Diabetes Points
        let dbPoints = 0;
        if (diabetes === 'Yes') {
            dbPoints = sex === 'Male' ? 2 : 4;
        }
        points += dbPoints;
        breakdown.push({ parameter: "Diabetes", value: diabetes, contribution: `${dbPoints} points` });

        // 5. SBP Points (Treated vs Untreated - assuming untreated if not specified, but spec says "Antihypertensive Medication?" is optional input)
        // For prototype, assume strict correlation to SBP value
        let sbpPoints = 0;
        if (sbp >= 160) sbpPoints = 3; // + treatment usually adds more
        else if (sbp >= 140) sbpPoints = 2;
        else if (sbp >= 130) sbpPoints = 1;
        else if (sbp >= 120) sbpPoints = 0;
        else sbpPoints = -1; // optimal

        points += sbpPoints;
        breakdown.push({ parameter: "SBP", value: sbp, contribution: `${sbpPoints} points` });

        // 6. HDL Points (General CVD 2008)
        let hdlPoints = 0;
        const hdlVal = params.hdl || 0;
        let hdlMg = hdlVal;

        // Convert if needed (approximate)
        if (params.hdl_unit === 'mmol/L') {
            hdlMg = hdlVal * 38.67;
        }

        if (hdlMg >= 60) hdlPoints = -1; // Protective
        else if (hdlMg < 40 && hdlMg > 0) hdlPoints = 2; // Risk factor
        else hdlPoints = 0; // Normal (40-59)

        points += hdlPoints;
        if (hdlMg > 0) {
            breakdown.push({
                parameter: "HDL Cholesterol",
                value: `${hdlVal} ${params.hdl_unit || 'mg/dL'}`,
                contribution: `${hdlPoints} points`
            });
        }

        // Risk Calculation from Points
        // 10-year risk map (Mock)
        let riskPercent = 1;
        if (points < 0) riskPercent = 1;
        else if (points <= 4) riskPercent = 2;
        else if (points <= 9) riskPercent = 5;
        else if (points <= 14) riskPercent = 10;
        else if (points <= 19) riskPercent = 20;
        else if (points <= 25) riskPercent = 30;
        else riskPercent = 40;

        let riskCategory: CalculationResult['category'] = 'Low';
        if (riskPercent < 10) riskCategory = 'Low';
        else if (riskPercent < 20) riskCategory = 'Moderate';
        else if (riskPercent < 30) riskCategory = 'High';
        else if (riskPercent < 40) riskCategory = 'Very High';
        else riskCategory = 'Extremely High';

        return {
            riskPercent: riskPercent,
            category: riskCategory,
            breakdown,
            notes: [
                "Used Framingham 2008 General CVD point-based algorithm.",
                hdlPoints === -1 ? "High HDL is protective (-1 point)." :
                    hdlPoints === 2 ? "Low HDL is a risk factor (+2 points)." : ""
            ].filter(Boolean)
        };
    }
}
