import { CalculatorAdapter, CalculationParameters, CalculationResult } from './CalculatorAdapter';

export class WhoIshNonLabAdapter implements CalculatorAdapter {
    calculate(params: CalculationParameters): CalculationResult {
        const { age, sex, sbp, diabetes, smoking } = params;
        const notes: string[] = [];

        // 1. Age Mapping
        let ageBand = 0;
        if (age < 40) {
            ageBand = 40;
            notes.push("WHO/ISH charts begin at age 40. Patients under 40 were assessed using the 40–49 age band; interpret results cautiously.");
        } else if (age >= 40 && age < 50) ageBand = 40;
        else if (age >= 50 && age < 60) ageBand = 50;
        else if (age >= 60 && age < 70) ageBand = 60;
        else ageBand = 70;

        // 2. SBP Band Mapping
        let sbpBand = "";
        if (sbp < 120) sbpBand = "<120";
        else if (sbp < 140) sbpBand = "120-139";
        else if (sbp < 160) sbpBand = "140-159";
        else if (sbp < 180) sbpBand = "160-179";
        else sbpBand = ">=180";

        // Lookup Logic (Simplified Mock)
        // Without TC, risk estimation is slightly less precise.

        let mockRiskParams = 0;
        if (ageBand >= 50) mockRiskParams++;
        if (ageBand >= 60) mockRiskParams++;
        if (diabetes === 'Yes') mockRiskParams++; // Diabetes counts more in non-lab?
        if (smoking === 'Yes') mockRiskParams++;
        if (sbp >= 140) mockRiskParams++;
        if (sbp >= 160) mockRiskParams += 1;

        let riskCategory: CalculationResult['category'] = 'Low';
        let riskVal = "<10%";

        if (mockRiskParams <= 1) { riskCategory = 'Low'; riskVal = "<10%"; }
        else if (mockRiskParams <= 3) { riskCategory = 'Moderate'; riskVal = "10-20%"; }
        else if (mockRiskParams <= 4) { riskCategory = 'High'; riskVal = "20-30%"; }
        else if (mockRiskParams <= 5) { riskCategory = 'Very High'; riskVal = "30-40%"; }
        else { riskCategory = 'Extremely High'; riskVal = ">40%"; }

        return {
            riskPercent: riskVal,
            category: riskCategory,
            breakdown: [
                { parameter: "Age", value: age, contribution: `Mapped to band ${ageBand}-${ageBand + 9}` },
                { parameter: "Sex", value: sex, contribution: "Factor in chart selection" },
                { parameter: "SBP", value: sbp, contribution: `Mapped to band ${sbpBand}` },
                { parameter: "Diabetes", value: diabetes, contribution: diabetes === 'Yes' ? "Increases risk" : "Baseline" },
                { parameter: "Smoking", value: smoking, contribution: smoking === 'Yes' ? "Increases risk" : "Baseline" }
            ],
            notes
        };
    }
}
