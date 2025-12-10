import React from 'react';
import Tooltip from './Tooltip';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    tooltip?: string;
    options: { value: string | number; label: string }[];
    error?: string;
}

const Select = ({ label, tooltip, options, error, className, ...props }: SelectProps) => {
    return (
        <div className={clsx("mb-5", className)}>
            <div className="flex items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">{label}</label>
                {tooltip && <Tooltip text={tooltip} />}
            </div>
            <div className="relative">
                <select
                    className={clsx(
                        "block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm transition-all duration-200 appearance-none",
                        "focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none",
                        "hover:bg-white hover:border-gray-300",
                        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.75rem_center]",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-red-600 font-medium"
                >
                    <span className="mr-1">⚠️</span> {error}
                </motion.p>
            )}
        </div>
    );
};

export default Select;
