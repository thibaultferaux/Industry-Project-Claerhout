import clsx from "clsx";

interface DrawerProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({ open, children, className }) => {
  return (
    <div
      className={clsx(
        className,
        {
          "w-2/3": open,
          "w-0 pr-0": !open,
        },
        "h-full overflow-clip transition-all duration-700 ease-out-quint z-50 pr-12"
      )}
    >
      {children}
    </div>
  );
};

export default Drawer;
