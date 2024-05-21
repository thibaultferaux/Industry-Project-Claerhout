import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        className,
        {
          "bg-primary-orange text-white": variant === "primary",
          "bg-white border-2 border-primary-orange text-primary-text":
            variant === "secondary",
        },
        "px-5 py-2.5 text-small uppercase font-semibold"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
