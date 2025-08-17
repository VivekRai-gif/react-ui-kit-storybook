import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

const inputVariants = cva(
  'flex w-full rounded-lg text-foreground transition-colors-smooth focus-ring disabled:disabled-style placeholder:text-muted-foreground',
  {
    variants: {
      variant: {
        filled: [
          'bg-secondary border border-transparent shadow-inner-soft',
          'hover:bg-secondary-hover hover:shadow-sm',
          'focus:bg-background focus:border-primary focus:shadow-focus',
          'disabled:hover:bg-disabled'
        ],
        outlined: [
          'bg-background border border-border shadow-sm',
          'hover:border-muted-foreground/50 hover:shadow-md',
          'focus:border-primary focus:shadow-focus',
          'disabled:border-border'
        ],
        ghost: [
          'bg-transparent border-0 border-b-2 border-border rounded-none px-0',
          'hover:border-muted-foreground/70',
          'focus:border-primary focus:shadow-none',
          'disabled:border-disabled-foreground'
        ],
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-13 px-5 text-lg',
      },
      state: {
        default: '',
        invalid: [
          'border-destructive focus:border-destructive focus:ring-destructive/20',
          'bg-destructive/5'
        ],
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
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors-smooth',
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

const helperTextVariants = cva('text-xs mt-2 transition-colors-smooth', {
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
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className={cn(labelVariants({ state: inputState }))}>
            {label}
          </label>
        )}
        
        <div className="relative group">
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
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}

          {showPasswordToggle && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={cn(
                'absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground',
                'hover:text-primary transition-colors-smooth focus:outline-none focus:text-primary',
                'rounded-md focus-ring',
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
              className={cn(
                'absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground',
                'hover:text-primary transition-colors-smooth focus:outline-none focus:text-primary',
                'rounded-md focus-ring'
              )}
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