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
        r="122"
        fill="#ffffff"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="72 139 106 173 184 94"
        // points="88 136 112 160 168 104"
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
