import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ className, children, ...props }) => (
  <label
    className={cn("text-secondary-text text-sm mb-2", className)}
    {...props}
  >
    {children}
  </label>
);

export default Label;
