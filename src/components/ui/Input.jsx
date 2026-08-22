import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-industrial-500 uppercase tracking-wider mb-2">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400 group-focus-within:text-industrial-900 transition-colors">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
            w-full transition-all duration-300
            bg-white border text-industrial-900 text-sm rounded-lg
            focus:ring-2 focus:ring-industrial-900/5 focus:border-industrial-900
            ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5
            ${error ? 'border-red-500 animate-shake' : 'border-industrial-200'}
            placeholder:text-industrial-400
          `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400 hover:text-industrial-900 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    icon: PropTypes.elementType,
    className: PropTypes.string,
};

export default Input;
