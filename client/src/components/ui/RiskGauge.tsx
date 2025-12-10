import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
    riskPercent: number; // 0-100 (or >100)
    category: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ riskPercent, category }) => {
    // Determine color based on risk (simplified logic matching adapter)
    const getColor = (val: number) => {
        if (val < 10) return '#10B981'; // Green
        if (val < 20) return '#F59E0B'; // Yellow
        if (val < 30) return '#F97316'; // Orange
        if (val < 40) return '#EF4444'; // Red
        return '#7F1D1D'; // Dark Red
    };

    const color = getColor(riskPercent);

    const data = [
        { name: 'Risk', value: Math.min(riskPercent, 100), color: color },
        { name: 'Remaining', value: 100 - Math.min(riskPercent, 100), color: '#e5e7eb' },
    ];

    // Needle rotation (180 degrees map to 0-100)
    const rotation = -90 + (Math.min(riskPercent, 100) / 100) * 180;

    return (
        <div className="relative w-64 h-32 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Needle */}
            <motion.div
                initial={{ rotate: -90 }}
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 50, damping: 10 }}
                className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-800 origin-bottom rounded-full -ml-0.5"
                style={{ zIndex: 10 }}
            />

            {/* Center Pivot */}
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-900 rounded-full -ml-2 -mb-2 z-20" />

            <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-2xl font-bold" style={{ color }}>{riskPercent}%</span>
                <p className="text-sm text-gray-500 font-medium">{category}</p>
            </div>
        </div>
    );
};

export default RiskGauge;
