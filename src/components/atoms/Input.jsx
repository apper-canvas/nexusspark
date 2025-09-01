import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error = false,
  disabled = false,
  // Extract valid HTML input attributes
  value,
  defaultValue,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  onClick,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  name,
  id,
  required,
  readOnly,
  autoComplete,
  autoFocus,
  min,
  max,
  step,
  maxLength,
  minLength,
  pattern,
  accept,
  multiple,
  size,
  ...rest // Any other props that shouldn't go to input
}, ref) => {
  // Only pass valid HTML input attributes
  const inputProps = {
    value,
    defaultValue,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    onClick,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    name,
    id,
    required,
    readOnly,
    autoComplete,
    autoFocus,
    min,
    max,
    step,
    maxLength,
    minLength,
    pattern,
    accept,
    multiple,
    size
  };

  // Filter out undefined values
  const validInputProps = Object.fromEntries(
    Object.entries(inputProps).filter(([_, value]) => value !== undefined)
  );

  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        "w-full px-3 py-2 border rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "placeholder:text-slate-400",
        error 
          ? "border-error focus:border-error focus:ring-error/20" 
          : "border-slate-300 focus:border-primary focus:ring-primary/20",
        className
      )}
      {...validInputProps}
    />
  );
});

Input.displayName = "Input";

export default Input;