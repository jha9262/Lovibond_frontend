import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
    label,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    variant = 'primary',
    icon: Icon,
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gray-900 text-white hover:bg-black shadow-industrial-md',
        secondary: 'bg-white text-industrial-800 border-2 border-industrial-100 hover:bg-industrial-50 hover:border-industrial-200',
        outline: 'bg-transparent text-industrial-600 border border-industrial-200 hover:bg-industrial-50',
        ghost: 'bg-transparent text-industrial-500 hover:bg-industrial-50 shadow-none',
        danger: 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const variantStyle = variants[variant] || variants.primary;
    const sizeStyle = sizes.md; // Defaulting to medium for now

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
        >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {label}
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    icon: PropTypes.elementType,
};

export default Button;
