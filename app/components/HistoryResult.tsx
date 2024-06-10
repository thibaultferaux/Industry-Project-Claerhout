"use client";

import { Job } from "@/lib/types";
import { formatDate, formatFloat, formatResult } from "@/lib/utils";
import { getLocationName } from "@/lib/apiCalls";
import { useQuery } from "@tanstack/react-query";

interface HistoryResultProps {
  result: Job;
}

interface ResultGroupProps {
  label: string;
  value: string;
}

const HistoryResult: React.FC<HistoryResultProps> = ({ result }) => {
  const { data } = useQuery<string>({
    queryKey: ["locationName", result.coordinates],
    queryFn: () => getLocationName(result.coordinates),
  });

  return (
    <div className="w-full px-6 py-4 bg-light-gray bg-opacity-20">
      <div className="flex justify-between mb-2">
        <p className="text-h3">
          {data && `Regio ${data}`}
          <span className="block sm:inline sm:ml-4 text-sm text-secondary-text">
            Straal: {formatFloat((result.radius / 1000).toFixed(1))}km
          </span>
        </p>
        <p className="text-right">{formatDate(result.createdAt)}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <ResultGroup
          label="Aantal platte daken"
          value={result.totalFlatRoofs.toString()}
        />
        <ResultGroup
          label="Oppervlakte platte daken"
          value={`${formatResult(result.totalSurfaceAreaFlatRoofs)} m²`}
        />
        <ResultGroup
          label="Omtrek platte daken"
          value={`${formatResult(result.totalCircumferenceFlatRoofs)} m`}
        />
        <ResultGroup
          label="Ratio platte daken"
          value={`${Math.round(result.ratioFlatRoofs * 100)}%`}
        />
      </div>
    </div>
  );
};

const ResultGroup: React.FC<ResultGroupProps> = ({ label, value }) => (
  <div>
    <p className="text-small xl:text-base text-secondary-text">{label}</p>
    <p className="leading-tight text-h3 xl:text-h2">{value}</p>
  </div>
);

export default HistoryResult;
