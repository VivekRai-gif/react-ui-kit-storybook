import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

const inputVariants = cva(
  'flex w-full transition-all duration-normal ease-in-out focus-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        filled: 'bg-secondary border border-transparent focus:border-primary focus:bg-background',
        outlined: 'bg-transparent border border-border focus:border-primary focus:shadow-sm',
        ghost: 'bg-transparent border-0 border-b-2 border-border focus:border-primary rounded-none px-0',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-5 text-lg',
      },
      state: {
        default: '',
        invalid: 'border-destructive focus:border-destructive focus:ring-destructive/20',
        loading: 'pr-10',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      size: 'md',
      state: 'default',
    },
  }
);

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      state: {
        default: 'text-foreground',
        invalid: 'text-destructive',
        loading: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

const helperTextVariants = cva('text-xs mt-1', {
  variants: {
    state: {
      default: 'text-muted-foreground',
      invalid: 'text-destructive',
      loading: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  invalid?: boolean;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      label,
      helperText,
      errorMessage,
      invalid = false,
      loading = false,
      disabled = false,
      clearable = false,
      onClear,
      type = 'text',
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');
    
    const currentValue = value !== undefined ? value : internalValue;
    const isPassword = type === 'password';
    const hasValue = currentValue && currentValue.toString().length > 0;
    const showClearButton = clearable && hasValue && !disabled && !loading;
    const showPasswordToggle = isPassword && !disabled && !loading;
    
    const inputState = invalid || errorMessage ? 'invalid' : loading ? 'loading' : 'default';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      props.onChange?.(e);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue('');
      }
      onClear?.();
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const displayType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={cn('space-y-1', containerClassName)}>
        {label && (
          <label className={cn(labelVariants({ state: inputState }))}>
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            type={displayType}
            className={cn(
              inputVariants({ variant, size, state: inputState }),
              showPasswordToggle && 'pr-10',
              showClearButton && 'pr-10',
              showPasswordToggle && showClearButton && 'pr-16',
              className
            )}
            ref={ref}
            disabled={disabled}
            value={currentValue}
            onChange={handleInputChange}
            aria-invalid={invalid || !!errorMessage}
            aria-describedby={
              errorMessage ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />

          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {showPasswordToggle && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={cn(
                'absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-fast',
                showClearButton && 'right-8'
              )}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {showClearButton && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-fast"
              tabIndex={-1}
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {(errorMessage || helperText) && (
          <p
            className={cn(helperTextVariants({ state: inputState }))}
            id={errorMessage ? `${props.id}-error` : `${props.id}-helper`}
            role={errorMessage ? 'alert' : undefined}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export { InputField, inputVariants };