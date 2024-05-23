import { cn } from "@/lib/utils";

interface PinProps {
  fill?: string;
  className?: string;
}

const Pin: React.FC<PinProps> = ({ fill = "#de6c27", className }) => {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 53 77.67"
    >
      <path
        d="M26.5,0C11.86,0,0,11.86,0,26.5c0,17.88,26.5,51.17,26.5,51.17,0,0,26.5-33.33,26.5-51.17C53,11.86,41.14,0,26.5,0ZM26.5,36.81c-5.69,0-10.31-4.61-10.31-10.31s4.61-10.31,10.31-10.31,10.31,4.61,10.31,10.31-4.61,10.31-10.31,10.31Z"
        fill={fill}
      />
    </svg>
  );
};

export default Pin;
