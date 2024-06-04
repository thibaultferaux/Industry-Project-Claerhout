import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        className,
        {
          "bg-primary-orange text-white disabled:bg-light-orange": variant === "primary",
          "bg-white border-[1px] border-primary-orange text-primary-text disabled:bg-opacity-50":
            variant === "secondary",
        },
        "px-5 py-2.5 text-small uppercase font-semibold disabled:cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
