// src/components/ui/input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
    return (
        <input
            className={`
        w-full px-3 py-2 
        border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            {...props}
        />
    );
};

export { Input };