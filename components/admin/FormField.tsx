'use client';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea' | 'number' | 'url' | 'select';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  options,
  rows = 4,
}: FormFieldProps) {
  const baseClasses =
    'w-full px-4 py-3 rounded-xl border bg-white text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm';
  const borderClass = error ? 'border-red-300' : 'border-slate-200';

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text-primary tracking-tight mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseClasses} ${borderClass} resize-y`}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`${baseClasses} ${borderClass}`}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${borderClass}`}
        />
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 tracking-tight">{error}</p>
      )}
    </div>
  );
}
