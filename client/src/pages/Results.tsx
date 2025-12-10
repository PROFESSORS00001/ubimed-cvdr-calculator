import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import type { CalculationRecord } from '../types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RiskGauge from '../components/ui/RiskGauge';
import WhatIfSimulator from '../components/calculator/WhatIfSimulator';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFReport from '../components/reports/PDFReport';
import { HiArrowLeft, HiDownload, HiRefresh, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Results = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [record, setRecord] = useState<CalculationRecord | null>(location.state?.result || null);
    const [loading, setLoading] = useState(!record);
    const [error, setError] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    const handleSendEmail = async () => {
        if (!email.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }
        setSendingEmail(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            await axios.post(`${apiUrl}/notify/email`, {
                email,
                recordId: record?.id,
                studyCode: record?.study_code
            });
            toast.success(`Report queued for ${email}`);
            setShowEmailModal(false);
            setEmail('');
        } catch (err) {
            toast.error('Failed to send email');
        } finally {
            setSendingEmail(false);
        }
    };

    useEffect(() => {
        if (!record && id) {
            const fetchResult = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                    const response = await axios.get(`${apiUrl}/calculation/${id}`);
                    setRecord(response.data);
                } catch (err) {
                    setError('Failed to load results. They may not exist or the service is down.');
                } finally {
                    setLoading(false);
                }
            };
            fetchResult();
        }
    }, [id, record]);

    if (loading) return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    if (error || !record) return <div className="text-center py-20 text-red-600 p-4">{error || 'Result not found'}</div>;

    const { riskPercent, category, breakdown, notes } = record.computed;
    const numericRisk = typeof riskPercent === 'number' ? riskPercent : parseInt(riskPercent);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link to="/calculator" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                    <HiArrowLeft className="mr-2" /> Back to Calculator
                </Link>
                <div className="flex gap-3">
                    <Link to="/calculator">
                        <Button variant="outline" size="sm">
                            <HiRefresh className="mr-2" /> New Calculation
                        </Button>
                    </Link>

                    <PDFDownloadLink document={<PDFReport record={record} />} fileName={`UBIMED_Report_${record.study_code}.pdf`}>
                        {({ loading }) => (
                            <Button variant="primary" size="sm" isLoading={loading}>
                                <HiDownload className="mr-2" /> {loading ? 'Generating PDF...' : 'Download Full Report'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* Email Modal */}
            {
                showEmailModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <HiX className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">Email Report</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Send a secure link of this risk assessment report to the patient or referring doctor.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="doctor@hospital.com"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                <div className="flex gap-3 justify-end pt-2">
                                    <Button variant="ghost" onClick={() => setShowEmailModal(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={handleSendEmail} isLoading={sendingEmail}>
                                        Send Report
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Main Result Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Result Visual */}
                <Card className="lg:col-span-1 p-6 flex flex-col justify-center items-center text-center bg-white border-t-4 border-t-primary-500">
                    <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-6">10-Year CVD Risk Estimate</h2>

                    <RiskGauge riskPercent={numericRisk} category={category} />

                    <div className="mt-6 w-full">
                        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500 text-left">
                            <strong>Interpretation:</strong> This estimates the probability of a cardiovascular event (stroke, MI) occurring in the next 10 years.
                        </div>
                    </div>
                </Card>

                {/* Details Breakdown */}
                <Card className="lg:col-span-2 p-6" delay={0.1}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Patient Factors</h3>
                        <Badge color="gray">{record.study_code}</Badge>
                    </div>

                    <div className="overflow-hidden bg-white border border-gray-100 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Parameter</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference/Target</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Clinical Interpretation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {breakdown?.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.parameter}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.value}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 text-xs">
                                            {item.parameter.includes("BP") ? "< 140/90 mmHg" :
                                                item.parameter.includes("Cholesterol") ? "< 200 mg/dL" :
                                                    item.parameter.includes("HDL") ? "> 40 mg/dL" : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.contribution.includes("High") || item.contribution.includes("Elevated") ? "bg-red-50 text-red-700" :
                                                item.contribution.includes("Risk") ? "bg-amber-50 text-amber-700" :
                                                    item.contribution.includes("Protective") ? "bg-green-50 text-green-700" :
                                                        "bg-gray-100 text-gray-600"
                                                }`}>
                                                {item.contribution}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {notes && notes.length > 0 && (
                        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Clinical Notes</h3>
                                    <div className="mt-2 text-sm text-yellow-700 space-y-1">
                                        {notes?.map((note: string, idx: number) => <p key={idx}>• {note}</p>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Simulator Section */}
            <WhatIfSimulator originalRecord={record} />
        </div >
    );
};

export default Results;
