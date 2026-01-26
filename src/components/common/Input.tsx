import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <input
        id={inputId}
        className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={textareaId} className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <textarea
        id={textareaId}
        className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
