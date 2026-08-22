import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', title, subtitle, footer }) => {
    return (
        <div className={`bg-white border border-industrial-200 rounded-xl overflow-hidden shadow-industrial-sm ${className}`}>
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-industrial-100 bg-industrial-50/50">
                    {title && <h3 className="text-lg font-bold text-industrial-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-industrial-500 mt-0.5">{subtitle}</p>}
                </div>
            )}
            <div className="px-6 py-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-industrial-50 border-t border-industrial-100 text-xs text-industrial-500">
                    {footer}
                </div>
            )}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    footer: PropTypes.node,
};

export default Card;
