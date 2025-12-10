import Tooltip from './Tooltip';

interface RadioOption {
    value: string;
    label: string;
}

interface RadioGroupProps {
    label: string;
    name: string;
    options: RadioOption[];
    value: string;
    onChange: (val: string) => void;
    tooltip?: string;
    error?: string;
}

const RadioGroup = ({ label, name, options, value, onChange, tooltip, error }: RadioGroupProps) => {
    return (
        <div className="mb-4">
            <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {tooltip && <Tooltip text={tooltip} />}
            </div>
            <div className="flex space-x-4">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${name}-${option.value}`}
                            name={name}
                            type="radio"
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default RadioGroup;
