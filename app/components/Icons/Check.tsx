import { cn } from "@/lib/utils";

interface CheckProps {
  fill?: string;
  className?: string;
}

const Check: React.FC<CheckProps> = ({ fill = "#4A4949", className }) => {
  return (
    <svg
      className={cn("h-3 w-3 overflow-visible", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none" />
      <circle
        cx="128"
        cy="128"
        r="128"
        fill="#ffffff"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="80 128 116 164 176 104"
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="20"
      />
    </svg>
  );
};

export default Check;
