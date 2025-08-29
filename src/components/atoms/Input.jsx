import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed bg-white";
  
  const errorClasses = error 
    ? "border-error focus:border-error" 
    : "border-slate-300 focus:border-primary";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        errorClasses,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;