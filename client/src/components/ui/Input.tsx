import React from 'react';
import Tooltip from './Tooltip';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    tooltip?: string;
    error?: string;
    addonRight?: React.ReactNode;
}

const Input = ({ label, tooltip, error, className, addonRight, ...props }: InputProps) => {
    return (
        <div className={clsx("mb-5", className)}>
            <div className="flex items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">{label}</label>
                {tooltip && <Tooltip text={tooltip} />}
            </div>
            <div className="relative group">
                <input
                    className={clsx(
                        "block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm transition-all duration-200",
                        "focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none",
                        "hover:bg-white hover:border-gray-300",
                        "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                        addonRight && "pr-10"
                    )}
                    {...props}
                />
                {addonRight && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        {addonRight}
                    </div>
                )}
                <div className="absolute inset-0 rounded-lg pointer-events-none border border-transparent peer-focus:border-primary-500 transition-colors" />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-red-600 font-medium flex items-center"
                >
                    <span className="mr-1">⚠️</span> {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
