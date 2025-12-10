import { CalculatorAdapter, CalculationParameters, CalculationResult } from './CalculatorAdapter';

export class WhoIshLabAdapter implements CalculatorAdapter {
    calculate(params: CalculationParameters): CalculationResult {
        const { age, sex, sbp, diabetes, smoking, tc, tc_unit } = params;
        const notes: string[] = [];

        // 1. Age Mapping
        let ageBand = 0;
        if (age < 40) {
            ageBand = 40; // Map 18-39 to 40
            notes.push("WHO/ISH charts begin at age 40. Patients under 40 were assessed using the 40–49 age band; interpret results cautiously.");
        } else if (age >= 40 && age < 50) ageBand = 40;
        else if (age >= 50 && age < 60) ageBand = 50;
        else if (age >= 60 && age < 70) ageBand = 60;
        else ageBand = 70; // 70+

        // 2. Unit Conversion (TC)
        let tcVal = tc || 0;
        if (tc_unit === 'mg/dL') {
            tcVal = tcVal / 38.67;
        }

        // 3. TC Band Mapping (mmol/L)
        // Bands: <4, 4-4.9, 5-5.9, 6-6.9, 7-7.9, >=8
        let tcBand = "";
        if (tcVal < 4) tcBand = "<4";
        else if (tcVal < 5) tcBand = "4-4.9";
        else if (tcVal < 6) tcBand = "5-5.9";
        else if (tcVal < 7) tcBand = "6-6.9";
        else if (tcVal < 8) tcBand = "7-7.9";
        else tcBand = ">=8";

        // 4. SBP Band Mapping
        // Bands: <120, 120-139, 140-159, 160-179, >=180
        let sbpBand = "";
        if (sbp < 120) sbpBand = "<120";
        else if (sbp < 140) sbpBand = "120-139";
        else if (sbp < 160) sbpBand = "140-159";
        else if (sbp < 180) sbpBand = "160-179";
        else sbpBand = ">=180";

        // 5. Lookup (Simplified Mock Logic for Prototype)
        // TODO: Replace with full JSON Table lookup
        // For demonstration, simplistic logic:
        // Base risk 5%. +5% per risk factor (Diabetes, Smoking, High SBP, High TC, Age)

        let mockRiskParams = 0;
        if (ageBand >= 50) mockRiskParams++;
        if (ageBand >= 60) mockRiskParams++;
        if (diabetes === 'Yes') mockRiskParams++;
        if (smoking === 'Yes') mockRiskParams++;
        if (sbp >= 140) mockRiskParams++;
        if (sbp >= 160) mockRiskParams++;
        if (tcVal >= 6) mockRiskParams++;
        if (tcVal >= 7) mockRiskParams++;

        let riskCategory: CalculationResult['category'] = 'Low';
        let riskVal = "<10%";

        // Very rough approximation of the table logic for now
        if (mockRiskParams <= 1) { riskCategory = 'Low'; riskVal = "<10%"; }
        else if (mockRiskParams <= 3) { riskCategory = 'Moderate'; riskVal = "10-20%"; }
        else if (mockRiskParams <= 5) { riskCategory = 'High'; riskVal = "20-30%"; }
        else if (mockRiskParams <= 6) { riskCategory = 'Very High'; riskVal = "30-40%"; }
        else { riskCategory = 'Extremely High'; riskVal = ">40%"; }


        return {
            riskPercent: riskVal,
            category: riskCategory,
            breakdown: [
                { parameter: "Age", value: age, contribution: `Mapped to band ${ageBand}-${ageBand + 9}` },
                { parameter: "Sex", value: sex, contribution: "Factor in chart selection" },
                { parameter: "SBP", value: sbp, contribution: `Mapped to band ${sbpBand}` },
                { parameter: "TC", value: tcVal.toFixed(1) + " mmol/L", contribution: `Mapped to band ${tcBand}` },
                { parameter: "Diabetes", value: diabetes, contribution: diabetes === 'Yes' ? "Increases risk" : "Baseline" },
                { parameter: "Smoking", value: smoking, contribution: smoking === 'Yes' ? "Increases risk" : "Baseline" }
            ],
            notes
        };
    }
}
