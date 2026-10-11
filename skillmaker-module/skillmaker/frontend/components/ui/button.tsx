import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-full',
    md: 'text-sm px-5 py-2.5 rounded-full',
    lg: 'text-base font-semibold px-7 py-3.5 rounded-full shadow-md',
  };

  const variantClasses = {
    primary: 'bg-primary-container hover:bg-primary text-on-primary font-semibold shadow-md hover:shadow-lg focus:ring-primary',
    secondary: 'bg-surface-container hover:bg-surface-container-high text-on-surface focus:ring-secondary',
    outline: 'border border-outline-variant hover:border-primary hover:bg-surface-container-low text-on-surface focus:ring-primary',
    ghost: 'hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface',
    error: 'bg-error text-white hover:bg-error/90',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
