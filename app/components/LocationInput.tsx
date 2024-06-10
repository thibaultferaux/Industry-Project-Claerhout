import SearchIcon from "./Icons/Search";

interface LocationInputProps {
  value: string;
  setValue: (value: string) => void;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  setValue,
  className,
}) => {
  return (
    <div className={className}>
      <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
        <SearchIcon fill="#4A4949" className="h-4 w-4" />
      </div>
      <input
        type="text"
        placeholder="Zoek op locatie"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-white text-small p-2 border-[1px] border-secondary-text pl-9"
      />
    </div>
  );
};

export default LocationInput;
