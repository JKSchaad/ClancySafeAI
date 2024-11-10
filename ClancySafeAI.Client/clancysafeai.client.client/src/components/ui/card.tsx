// src/components/ui/card.tsx

import React from 'react';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <h3 className={`text-lg font-semibold ${className}`}>
        {children}
    </h3>
);

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <p className={`text-sm text-gray-500 ${className}`}>
        {children}
    </p>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };