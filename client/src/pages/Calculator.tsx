import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import RadioGroup from '../components/ui/RadioGroup';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { CalculationParameters } from '../types';
import axios from 'axios';
import { HiLightningBolt, HiSave, HiClipboardList } from 'react-icons/hi';

const Calculator = () => {
    const navigate = useNavigate();
    const [chartType, setChartType] = useState<'WHO_ISH_LAB' | 'WHO_ISH_NONLAB' | 'FRAMINGHAM_TC'>('WHO_ISH_LAB');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<{
        study_code: string;
        params: CalculationParameters;
    }>({
        study_code: '',
        params: {
            age: '',
            sex: 'Male',
            sbp: '',
            diabetes: 'No',
            smoking: 'No',
            tc: '',
            tc_unit: 'mmol/L',
            hdl: '',
            hdl_unit: 'mmol/L',
            treatment: 'No'
        }
    });

    const updateParam = (field: keyof CalculationParameters, value: any) => {
        setFormData(prev => ({
            ...prev,
            params: { ...prev.params, [field]: value }
        }));
    };

    const convertTc = (newUnit: 'mmol/L' | 'mg/dL') => {
        const currentTc = formData.params.tc;
        if (!currentTc) {
            updateParam('tc_unit', newUnit);
            return;
        }

        // precise conversion
        let newVal = currentTc as number;
        if (formData.params.tc_unit === 'mg/dL' && newUnit === 'mmol/L') {
            newVal = newVal / 38.67;
        } else if (formData.params.tc_unit === 'mmol/L' && newUnit === 'mg/dL') {
            newVal = newVal * 38.67;
        }

        setFormData(prev => ({
            ...prev,
            params: { ...prev.params, tc: parseFloat(newVal.toFixed(2)), tc_unit: newUnit }
        }));
    };

    const handleSubmit = async (status: 'draft' | 'complete') => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                study_code: formData.study_code,
                chart: chartType,
                parameters: formData.params,
                status
            };

            const apiUrl = import.meta.env.VITE_API_URL || 'https://ubimed-cvdr-calculator.onrender.com/api';
            const response = await axios.post(`${apiUrl}/calculation`, payload);

            if (response.data && response.data.id) {
                if (status === 'complete') {
                    navigate(`/results/${response.data.id}`, { state: { result: response.data } });
                } else {
                    navigate('/history');
                }
            }
        } catch (err) {
            console.error(err);
            setError("Calculation failed. Please check inputs or backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Risk Calculator</h1>
                <p className="mt-2 text-lg text-gray-600">Enter patient data to estimate 10-year CVD risk.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-5 border-l-4 border-l-primary-500">
                        <div className="flex items-center mb-4 text-primary-700 font-bold uppercase text-xs tracking-wider">
                            <HiClipboardList className="mr-2 h-4 w-4" /> Prediction Model
                        </div>
                        <div className="space-y-2">
                            {['WHO_ISH_LAB', 'WHO_ISH_NONLAB', 'FRAMINGHAM_TC'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setChartType(type as any)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all ${chartType === type
                                        ? 'bg-primary-600 text-white shadow-md transform scale-[1.02]'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <span>{type.replace(/_/g, ' ')}</span>
                                    {chartType === type && <div className="h-2 w-2 rounded-full bg-white" />}
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                            Select <strong>Lab</strong> if cholesterol data is available. <strong>Non-Lab</strong> uses BMI proxy. <strong>Framingham</strong> is a general alternative.
                        </p>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-center mb-4 text-gray-500 font-bold uppercase text-xs tracking-wider">
                            Study Details
                        </div>
                        <Input
                            label="Participant ID / Code"
                            tooltip="Unique alphanumeric identifier (e.g. KGH001)"
                            value={formData.study_code}
                            onChange={(e) => setFormData({ ...formData, study_code: e.target.value })}
                            placeholder="e.g. PT-2024-001"
                            className="mb-0"
                        />
                    </Card>
                </div>

                {/* Right Column: Form */}
                <div className="lg:col-span-2">
                    <Card className="p-8">
                        <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Patient Parameters</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Age (years)"
                                type="number"
                                tooltip="Patient age (18-120)."
                                value={formData.params.age}
                                onChange={(e) => updateParam('age', parseInt(e.target.value))}
                                placeholder="45"
                                required
                            />

                            <Select
                                label="Sex"
                                options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
                                value={formData.params.sex}
                                onChange={(e) => updateParam('sex', e.target.value)}
                            />

                            <Input
                                label="Systolic BP (mmHg)"
                                type="number"
                                tooltip="Recent clinic systolic blood pressure."
                                value={formData.params.sbp}
                                onChange={(e) => updateParam('sbp', parseInt(e.target.value))}
                                placeholder="120"
                                required
                            />

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <RadioGroup
                                    label="Smoking Status"
                                    name="smoking"
                                    options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                                    value={formData.params.smoking}
                                    onChange={(v) => updateParam('smoking', v)}
                                />

                                <RadioGroup
                                    label="Diabetes Status"
                                    name="diabetes"
                                    options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                                    value={formData.params.diabetes}
                                    onChange={(v) => updateParam('diabetes', v)}
                                />
                            </div>

                            {/* Conditional Cholesterol */}
                            {(chartType === 'WHO_ISH_LAB' || chartType === 'FRAMINGHAM_TC') && (
                                <div className="md:col-span-2 bg-blue-50/50 rounded-xl p-6 border border-blue-100/50 space-y-4">
                                    {/* Total Cholesterol */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-sm font-bold text-blue-900">Total Cholesterol</h3>
                                            <div className="flex bg-white rounded-lg p-0.5 border border-blue-200">
                                                <button
                                                    type="button"
                                                    onClick={() => convertTc('mmol/L')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${formData.params.tc_unit === 'mmol/L' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}
                                                >
                                                    mmol/L
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => convertTc('mg/dL')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${formData.params.tc_unit === 'mg/dL' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}
                                                >
                                                    mg/dL
                                                </button>
                                            </div>
                                        </div>
                                        <Input
                                            label={`Value (${formData.params.tc_unit})`}
                                            type="number"
                                            step="0.1"
                                            tooltip="Enter Total Cholesterol (TC). Found in lipid profile."
                                            value={formData.params.tc}
                                            onChange={(e) => updateParam('tc', parseFloat(e.target.value))}
                                            placeholder={formData.params.tc_unit === 'mmol/L' ? '5.2' : '200'}
                                            className="mb-0 bg-white"
                                        />
                                    </div>

                                    {/* HDL Cholesterol (Framingham Only) */}
                                    {chartType === 'FRAMINGHAM_TC' && (
                                        <div className="pt-4 border-t border-blue-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-bold text-blue-900">HDL Cholesterol</h3>
                                                <span className="text-xs text-blue-600 font-medium">Auto-converts with TC unit</span>
                                            </div>
                                            <Input
                                                label={`HDL Value (${formData.params.tc_unit})`}
                                                type="number"
                                                step="0.1"
                                                tooltip="High-Density Lipoprotein. Higher is better."
                                                value={formData.params.hdl}
                                                onChange={(e) => updateParam('hdl', parseFloat(e.target.value))}
                                                placeholder={formData.params.tc_unit === 'mmol/L' ? '1.5' : '50'}
                                                className="mb-0 bg-white"
                                            />
                                            <p className="text-xs text-blue-500 mt-2">
                                                * High HDL (&gt;60 mg/dL) lowers risk score (-1 point).
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-start">
                                <span className="mr-2 text-lg">⚠️</span>
                                {error}
                            </div>
                        )}

                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                            <Button
                                variant="outline"
                                onClick={() => handleSubmit('draft')}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                <HiSave className="mr-2" /> Save Draft
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => handleSubmit('complete')}
                                isLoading={loading}
                                className="w-full sm:w-auto shadow-lg shadow-primary-500/20"
                            >
                                <HiLightningBolt className="mr-2" /> Calculate Risk
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
