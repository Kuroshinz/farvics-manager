import * as React from 'react';
import { useController, Control } from 'react-hook-form';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
}

export function CurrencyInput({ name, control, label, error, className, ...props }: CurrencyInputProps) {
  const {
    field: { onChange, onBlur, name: fieldName, value, ref },
  } = useController({
    name,
    control,
    defaultValue: 0,
  });

  const [displayValue, setDisplayValue] = React.useState<string>(() => {
    if (value === undefined || value === null || value === 0) return '';
    return value.toLocaleString();
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Remove all non-numeric characters
    val = val.replace(/\D/g, '');
    
    if (val === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }
    
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setDisplayValue(num.toLocaleString('en-US'));
      onChange(num);
    }
  };

  return (
    <div>
      {label && <label className="block text-xs font-medium text-content-secondary mb-1">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₫</span>
        <input
          {...props}
          ref={ref}
          name={fieldName}
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          type="text"
          className={`w-full bg-white/5 border border-white/10 rounded-lg p-2.5 pl-8 text-white outline-none focus:border-aurora-cyan/50 focus:bg-white/10 transition-all ${className || ''}`}
        />
      </div>
      {error && <span className="text-galaxy-red text-xs mt-1 block">{error}</span>}
    </div>
  );
}
