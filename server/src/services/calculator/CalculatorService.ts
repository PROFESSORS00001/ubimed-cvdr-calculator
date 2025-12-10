import { CalculatorAdapter, CalculationParameters, CalculationResult } from './CalculatorAdapter';
import { WhoIshLabAdapter } from './WhoIshLabAdapter';
import { WhoIshNonLabAdapter } from './WhoIshNonLabAdapter';
import { FraminghamAdapter } from './FraminghamAdapter';

export type ChartType = 'WHO_ISH_LAB' | 'WHO_ISH_NONLAB' | 'FRAMINGHAM_TC';

export class CalculatorService {
    private adapters: Record<ChartType, CalculatorAdapter>;

    constructor() {
        this.adapters = {
            'WHO_ISH_LAB': new WhoIshLabAdapter(),
            'WHO_ISH_NONLAB': new WhoIshNonLabAdapter(),
            'FRAMINGHAM_TC': new FraminghamAdapter()
        };
    }

    public calculate(chart: ChartType, params: CalculationParameters): CalculationResult {
        const adapter = this.adapters[chart];
        if (!adapter) {
            throw new Error(`Chart type ${chart} not supported.`);
        }
        return adapter.calculate(params);
    }
}

export const calculatorService = new CalculatorService();
