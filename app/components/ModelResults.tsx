import { Results } from "@/lib/types";
import Button from "./Button";

interface ResultsProps {
  results: Results;
  onClear: () => void;
}

const ModelResults: React.FC<ResultsProps> = ({ results, onClear }) => (
  <div className="w-full h-full flex flex-col justify-between">
    <div>
      <h2 className="text-h2 mb-4">Resultaten</h2>
      <p className="text-secondary-text">
        In de gewenste regio heeft het model de volgende resultaten gevonden:
      </p>
      <div className="mt-16 flex flex-col items-center">
        <p className="text-h1 leading-none">{results.flatRoofs}</p>
        <p className="text-secondary-text text-h3">platte daken</p>
      </div>
    </div>
    <Button variant="secondary" className="self-end" onClick={onClear}>
      Selecteer een nieuwe regio
    </Button>
  </div>
);

export default ModelResults;
