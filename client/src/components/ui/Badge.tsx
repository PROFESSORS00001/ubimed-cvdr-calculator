import React, { type ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    color?: 'green' | 'yellow' | 'orange' | 'red' | 'gray';
    size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', size = 'md' }) => {
    const colors = {
        green: 'bg-green-100 text-green-800 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        orange: 'bg-orange-100 text-orange-800 border-orange-200',
        red: 'bg-red-100 text-red-800 border-red-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full border ${colors[color]} ${sizes[size]}`}>
            {children}
        </span>
    );
};

export default Badge;
