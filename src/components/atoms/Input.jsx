import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error = false,
  disabled = false,
  ...props
}, ref) => {
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
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;