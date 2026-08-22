import React from 'react';
import PropTypes from 'prop-types';
import { HiOutlineChevronDown } from "react-icons/hi";

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Select Option",
    error,
    className = '',
    disabled = false,
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-industrial-500 uppercase tracking-wider mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full transition-all duration-300 appearance-none
            bg-white border text-industrial-900 text-sm rounded-lg
            focus:ring-2 focus:ring-industrial-900/5 focus:border-industrial-900
            px-4 py-2.5 pr-10
            ${error ? 'border-red-500' : 'border-industrial-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-industrial-50' : 'hover:border-industrial-300'}
          `}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value || option} value={option.value || option}>
                            {option.label || option}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400 pointer-events-none">
                    <HiOutlineChevronDown className="w-4 h-4" />
                </div>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
};

Select.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            }),
        ])
    ),
    placeholder: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Select;
