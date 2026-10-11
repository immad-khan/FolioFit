import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  error?: string;
}

export default function Input({
  className = '',
  icon,
  error,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant select-none pointer-events-none text-[20px]">
            {icon}
          </span>
        )}
        <input
          className={`w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm ${
            icon ? 'pl-11' : ''
          } ${error ? 'border-error ring-1 ring-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error mt-1.5 ml-1">{error}</p>}
    </div>
  );
}
