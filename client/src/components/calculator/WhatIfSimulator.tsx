import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import axios from 'axios';
import type { CalculationParameters, CalculationRecord } from '../../types';
import Badge from '../ui/Badge';

interface WhatIfSimulatorProps {
    originalRecord: CalculationRecord;
}

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ originalRecord }) => {
    const [simulatedParams, setSimulatedParams] = useState<CalculationParameters>(originalRecord.parameters);
    const [simulatedResult, setSimulatedResult] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const handleParameterChange = (key: keyof CalculationParameters, value: any) => {
        setSimulatedParams(prev => ({ ...prev, [key]: value }));
    };

    const runSimulation = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            // We use 'create' endpoint but with a 'draft' or 'simulation' status if we wanted to save,
            // but here we just want the computed result. 
            // Since our backend saves everything, we might polute DB. 
            // Ideally we'd have a 'dry-run' endpoint. 
            // For now, let's just create a new calculation but treat it as a simulation.

            const payload = {
                study_code: "SIMULATION",
                chart: originalRecord.chart_name,
                parameters: simulatedParams,
                status: 'draft' // Mark as draft so maybe we filter it out later or backend ignores
            };

            const response = await axios.post(`${apiUrl}/calculation`, payload);
            setSimulatedResult(response.data.computed);

        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (res: any) => {
        if (!res) return 'gray';
        const val = typeof res.riskPercent === 'number' ? res.riskPercent : parseInt(res.riskPercent);
        if (val < 10) return 'green';
        if (val < 20) return 'yellow';
        if (val < 30) return 'orange';
        return 'red';
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-blue-100 shadow-inner">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🧪</span> "What-If" Analysis Simulator
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Adjust the factors below to see how lifestyle changes could impact the 10-year CVD risk.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Systolic Blood Pressure (mmHg)</label>
                        <input
                            type="range"
                            min="90"
                            max="180"
                            value={simulatedParams.sbp || 120}
                            onChange={(e) => handleParameterChange('sbp', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="text-right text-sm font-bold text-primary-600">{simulatedParams.sbp} mmHg</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Status</label>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleParameterChange('smoking', 'Yes')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${simulatedParams.smoking === 'Yes' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white border border-gray-300 text-gray-500'}`}
                            >
                                Smoker
                            </button>
                            <button
                                onClick={() => handleParameterChange('smoking', 'No')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${simulatedParams.smoking === 'No' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white border border-gray-300 text-gray-500'}`}
                            >
                                Non-Smoker
                            </button>
                        </div>
                    </div>

                    {/* Add more controls as needed, e.g. Cholesterol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Cholesterol ({simulatedParams.tc_unit || 'mmol/L'})</label>
                        <input
                            type="range"
                            min="3"
                            max="15"
                            step="0.1"
                            value={simulatedParams.tc || 4}
                            onChange={(e) => handleParameterChange('tc', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="text-right text-sm font-bold text-primary-600">{simulatedParams.tc} {simulatedParams.tc_unit}</div>
                    </div>

                    <Button onClick={runSimulation} isLoading={loading} className="w-full">
                        Run Simulation
                    </Button>
                </div>

                {/* Results Comparison */}
                <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-center items-center">
                    {!simulatedResult ? (
                        <div className="text-center text-gray-400">
                            <p>Adjust parameters and click run to see potential improvement.</p>
                        </div>
                    ) : (
                        <div className="w-full text-center">
                            <h4 className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-6">Risk Comparison</h4>

                            <div className="flex justify-around items-end h-40">
                                {/* Current */}
                                <div className="flex flex-col items-center group">
                                    <div className="text-xs font-bold text-gray-500 mb-2">Current</div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min(Number(originalRecord.computed.riskPercent), 100)}%` }}
                                        className="w-16 bg-gray-300 rounded-t-md relative"
                                    >
                                        <div className="absolute -top-8 w-full text-center font-bold text-gray-700">
                                            {originalRecord.computed.riskPercent}%
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Simulated */}
                                <div className="flex flex-col items-center">
                                    <div className="text-xs font-bold text-primary-600 mb-2">Simulated</div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min(Number(simulatedResult.riskPercent), 100)}%` }}
                                        className={`w-16 rounded-t-md relative ${getRiskColor(simulatedResult) === 'green' ? 'bg-green-500' : 'bg-orange-500'}`}
                                    >
                                        <div className="absolute -top-8 w-full text-center font-bold text-primary-700">
                                            {simulatedResult.riskPercent}%
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-100">
                                <Badge color={getRiskColor(simulatedResult)} size="md">
                                    {simulatedResult.category} Risk
                                </Badge>
                                <p className="mt-2 text-xs text-gray-500">
                                    Potential reduction logic based on model parameters.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WhatIfSimulator;
