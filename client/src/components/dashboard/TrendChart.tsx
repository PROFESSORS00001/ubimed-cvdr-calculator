import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { format } from 'date-fns';
import type { CalculationRecord } from '../../types';

interface TrendChartProps {
  records: CalculationRecord[];
}

const TrendChart: React.FC<TrendChartProps> = ({ records }) => {
  // 1. Sort records by date ascending
  const sortedData = [...records]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(r => ({
      date: new Date(r.created_at),
      risk: typeof r.computed.riskPercent === 'number'
        ? r.computed.riskPercent
        : parseInt(r.computed.riskPercent) || 0,
      category: r.computed.category,
      sbp: r.parameters.sbp,
      cholesterol: r.parameters?.tc || 0
    }));

  if (sortedData.length === 0) {
    return <div className="text-center p-10 text-gray-400">No data available for trends.</div>;
  }

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Risk Progression Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(date, 'MMM d')}
            stroke="#94a3b8"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            unit="%"
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelFormatter={(date) => format(date as Date, 'MMM d, yyyy')}
          />
          {/* Risk Zones Background (Optional visual guide) */}
          <ReferenceArea y1={0} y2={10} fill="#ecfdf5" fillOpacity={0.3} />
          <ReferenceArea y1={10} y2={20} fill="#fffbeb" fillOpacity={0.3} />
          <ReferenceArea y1={20} y2={100} fill="#fef2f2" fillOpacity={0.3} />

          <Line
            type="monotone"
            dataKey="risk"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 8 }}
            name="Risk Score (%)"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center">
        <div className="flex items-center"><span className="w-3 h-3 bg-green-50 mr-2 border border-green-100"></span> Low Risk (&lt;10%)</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-yellow-50 mr-2 border border-yellow-100"></span> Moderate (10-20%)</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-red-50 mr-2 border border-red-100"></span> High (&gt;20%)</div>
      </div>
    </div>
  );
};

export default TrendChart;
