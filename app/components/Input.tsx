import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      spellCheck="false"
      className={cn(
        "flex h-10 w-full border border-secondary-text bg-white px-3 py-2 text-small focus-visible:outline-none placeholder:text-secondary-text text-opacity-60 focus-visible:border-primary-orange focus-visible:border focus-visible:rounded-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export default Input;
