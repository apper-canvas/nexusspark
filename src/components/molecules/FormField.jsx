import { forwardRef } from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = forwardRef(({ 
  label,
  error,
  helperText,
  required = false,
  className,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      <Input
        ref={ref}
        error={!!error}
        {...props}
      />
      {error && (
        <p className="text-xs text-error mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;