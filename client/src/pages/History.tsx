import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { CalculationRecord } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

import { HiSearch, HiEye, HiRefresh, HiDownload, HiChevronLeft, HiChevronRight, HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

import TrendChart from '../components/dashboard/TrendChart';

type SortField = 'date' | 'risk' | 'age';
type SortOrder = 'asc' | 'desc';

const History = () => {
    const [records, setRecords] = useState<CalculationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Advanced Features State
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                const response = await axios.get(`${apiUrl}/calculation`);
                setRecords(response.data);
            } catch (err) {
                console.warn("API unavailable, using mock data for demo.");
                setRecords([
                    {
                        id: 'mock-1',
                        study_code: 'KGH001',
                        chart_name: 'WHO_ISH_LAB',
                        parameters: { age: 55, sex: 'Male', sbp: 150, diabetes: 'Yes', smoking: 'No', tc: 6.0, tc_unit: 'mmol/L' },
                        computed: {
                            riskPercent: '20-30%',
                            category: 'High',
                            breakdown: [
                                { parameter: 'Age', value: '55', contribution: 'High Risk Factor' },
                                { parameter: 'SBP', value: '150', contribution: 'Elevated' }
                            ],
                            notes: ['Patient should lower SBP', 'Cessation of smoking advised']
                        },
                        status: 'complete',
                        created_at: new Date().toISOString()
                    },
                    {
                        id: 'mock-2',
                        study_code: 'KGH002',
                        chart_name: 'FRAMINGHAM_TC',
                        parameters: { age: 62, sex: 'Female', sbp: 140, diabetes: 'No', smoking: 'No', tc: 220, tc_unit: 'mg/dL' },
                        computed: {
                            riskPercent: 12,
                            category: 'Moderate',
                            breakdown: [
                                { parameter: 'Age', value: '62', contribution: 'Significant' },
                                { parameter: 'Cholesterol', value: '220', contribution: 'Moderate' }
                            ],
                            notes: []
                        },
                        status: 'complete',
                        created_at: new Date(Date.now() - 86400000).toISOString()
                    },
                    {
                        id: 'mock-3',
                        study_code: 'KGH003',
                        chart_name: 'WHO_ISH_NONLAB',
                        parameters: { age: 45, sex: 'Male', sbp: 120, diabetes: 'No', smoking: 'Yes', tc: 0, tc_unit: 'mmol/L' },
                        computed: {
                            riskPercent: '<10%',
                            category: 'Low',
                            breakdown: [],
                            notes: []
                        },
                        status: 'complete',
                        created_at: new Date(Date.now() - 172800000).toISOString()
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Filter & Sort Logic
    const processedRecords = useMemo(() => {
        let result = [...records];

        // 1. Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(r =>
                r.study_code.toLowerCase().includes(lower) ||
                r.chart_name.toLowerCase().includes(lower)
            );
        }

        // 2. Filter by Category
        if (filterCategory !== 'All') {
            result = result.filter(r => r.computed.category === filterCategory);
        }

        // 3. Sort
        result.sort((a, b) => {
            let valA, valB;

            if (sortField === 'date') {
                valA = new Date(a.created_at).getTime();
                valB = new Date(b.created_at).getTime();
            } else if (sortField === 'risk') {
                // Handle string ranges like "20-30%" by taking lower bound
                const getRiskVal = (val: string | number) => {
                    if (typeof val === 'number') return val;
                    return parseInt(val.replace(/[^0-9]/g, '')) || 0;
                };
                valA = getRiskVal(a.computed.riskPercent);
                valB = getRiskVal(b.computed.riskPercent);
            } else { // Age
                valA = a.parameters.age;
                valB = b.parameters.age;
            }

            return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        return result;
    }, [records, searchTerm, filterCategory, sortField, sortOrder]);

    // Analytics Logic
    const distinctPatients = useMemo(() => {
        const codes = new Set(processedRecords.map(r => r.study_code));
        return codes.size;
    }, [processedRecords]);

    const showTrends = distinctPatients === 1 && processedRecords.length > 1;

    // Pagination Logic
    const totalPages = Math.ceil(processedRecords.length / itemsPerPage);
    const paginatedRecords = processedRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc'); // Default to desc for new fields
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <span className="w-4 h-4 inline-block ml-1 opacity-20">↕</span>;
        return sortOrder === 'asc'
            ? <HiSortAscending className="w-4 h-4 inline-block ml-1 text-primary-600" />
            : <HiSortDescending className="w-4 h-4 inline-block ml-1 text-primary-600" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient History</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage, filter, and export patient risk records.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                            window.location.href = `${apiUrl}/export`;
                        }}
                        className="flex-1 md:flex-none justify-center"
                    >
                        <HiDownload className="mr-2" /> Export CSV
                    </Button>
                    <Link to="/calculator" className="flex-1 md:flex-none">
                        <Button size="sm" className="w-full justify-center">
                            <HiRefresh className="mr-2" /> New Calculation
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Trends Dashboard (Conditional) */}
            <AnimatePresence>
                {showTrends && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                    >
                        <TrendChart records={processedRecords} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Card className="overflow-hidden border border-gray-200 shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="relative w-full md:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search ID, Code..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Filter Risk:</span>
                        <select
                            className="block w-full md:w-40 pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Low">Low Risk</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High Risk</option>
                            <option value="Very High">Very High</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('date')}
                                >
                                    Date <SortIcon field="date" />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Study Code
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('age')}
                                >
                                    Age <SortIcon field="age" />
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                                    onClick={() => handleSort('risk')}
                                >
                                    Risk Level <SortIcon field="risk" />
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-500">Loading records...</td></tr>
                            ) : paginatedRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-100 rounded-full p-4 mb-3">
                                                <HiSearch className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium">No records found</p>
                                            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
                                            <button
                                                className="mt-4 text-primary-600 hover:text-primary-800 text-sm font-medium"
                                                onClick={() => { setSearchTerm(''); setFilterCategory('All'); }}
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {paginatedRecords.map((record) => (
                                        <motion.tr
                                            key={record.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="font-medium text-gray-900">{new Date(record.created_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-400">{new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.study_code}
                                                <div className="text-xs text-gray-400 font-normal">{record.chart_name.replace(/_/g, ' ')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {record.parameters.age} <span className="text-xs text-gray-400">yrs</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    color={
                                                        record.computed.category === 'Low' ? 'green' :
                                                            record.computed.category === 'Moderate' ? 'yellow' :
                                                                record.computed.category === 'High' ? 'orange' : 'red'
                                                    }
                                                >
                                                    {record.computed.category} ({record.computed.riskPercent}{typeof record.computed.riskPercent === 'number' && '%'})
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    to={`/results/${record.id}`}
                                                    state={{ result: record }}
                                                    className="text-primary-600 hover:text-primary-900 inline-flex items-center transition-colors bg-primary-50 px-3 py-1.5 rounded-md hover:bg-primary-100"
                                                >
                                                    <HiEye className="mr-1.5" /> View
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, processedRecords.length)}</span> of <span className="font-medium">{processedRecords.length}</span> results
                                </p>
                            </div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <HiChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default History;
