import { cn } from "@/lib/utils";

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
        "absolute left-0 w-full lg:w-[45%] xl:w-2/5 2xl:1/3 top-0 h-full max-h-full overflow-clip transition-all duration-700 ease-out-quint md:pr-12",
        { hidden: !open }
      )}
    >
      {children}
    </div>
  );
};

export default Drawer;
