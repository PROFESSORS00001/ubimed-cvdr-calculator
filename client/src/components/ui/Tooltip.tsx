import type { ReactNode } from 'react';
import { HiInformationCircle } from 'react-icons/hi';

interface TooltipProps {
    text: string;
    children?: ReactNode;
}

const Tooltip = ({ text }: TooltipProps) => {
    return (
        <div className="relative flex items-center group ml-2">
            <HiInformationCircle className="text-gray-400 hover:text-blue-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 text-center">
                {text}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
        </div>
    );
};

export default Tooltip;
