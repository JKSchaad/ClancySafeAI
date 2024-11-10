// src/components/ui/alert.tsx

import React from 'react';

interface AlertProps {
    children: React.ReactNode;
    variant?: 'default' | 'destructive';
    className?: string;
}

const Alert: React.FC<AlertProps> = ({
    children,
    variant = 'default',
    className = ''
}) => {
    const variants = {
        default: 'bg-blue-50 text-blue-900 border-blue-200',
        destructive: 'bg-red-50 text-red-900 border-red-200'
    };

    return (
        <div className={`p-4 rounded-md border ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <div className={`text-sm ${className}`}>
        {children}
    </div>
);

export { Alert, AlertDescription };