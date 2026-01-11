import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline';
    size?: 'default' | 'lg';
    children: ReactNode;
}

export default function Button({
    variant = 'default',
    size = 'default',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseClasses =
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variantClasses = {
        default:
            'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        outline:
            'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    };

    const sizeClasses = {
        default: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
