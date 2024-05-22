import { cn } from "@/lib/utils";
import clsx from "clsx";

interface DrawerProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({ open, children, className }) => {
  return (
    <div
      className={cn(
        className,
        "absolute left-0 w-1/3 top-0 h-full max-h-full overflow-clip transition-all duration-700 ease-out-quint pr-12",
        { hidden: !open }
      )}
    >
      {children}
    </div>
  );
};

export default Drawer;
