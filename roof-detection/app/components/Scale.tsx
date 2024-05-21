import clsx from "clsx";

interface ScaleProps {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  className?: string;
}

const Scale: React.FC<ScaleProps> = ({
  value,
  setValue,
  min,
  max,
  className,
}) => {
  return (
    <div className={clsx(className, "bg-white p-4 border-2 border-light-gray")}>
      <div className="flex justify-between">
        <p>Straal</p>
        <p>
          <span className="text-h3">{value}</span>km
        </p>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        min={min}
        max={max}
        step={1}
      />
    </div>
  );
};

export default Scale;
