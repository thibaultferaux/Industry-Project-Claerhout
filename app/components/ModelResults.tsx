import { Job } from "@/lib/types";
import Button from "./Button";
import React from "react";
import { formatResult } from "@/lib/utils";

interface ResultsProps {
  results: Job;
  onClear: () => void;
}

interface WrapperProps {
  children: React.ReactNode;
}

const ModelResults: React.FC<ResultsProps> = ({ results, onClear }) => {
  const flatRoofPercentage = () => {
    // Calculate ratio of the total surface area of sloped roofs for every flat roof
    const percentage = (results.totalSurfaceAreaFlatRoofs / (results.totalSurfaceAreaSlopedRoofs + results.totalSurfaceAreaFlatRoofs)) * 100;

    return Math.round(percentage);
  };

  console.log(results);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <h2 className="text-h2 mb-4">Resultaten</h2>
        <p className="text-secondary-text">
          In de gewenste regio heeft het model de volgende resultaten gevonden:
        </p>
        <div className="mt-8">
          <ResultWrapper>
            <ResultTitle>Aantal platte daken</ResultTitle>
            <ResultValue>{results.totalFlatRoofs}</ResultValue>
          </ResultWrapper>
          <ResultWrapper>
            <ResultTitle>Oppervlakte platte daken</ResultTitle>
            <ResultValue>
              {formatResult(results.totalSurfaceAreaFlatRoofs)} m²
            </ResultValue>
          </ResultWrapper>
          <ResultWrapper>
            <ResultTitle>Omtrek platte daken</ResultTitle>
            <ResultValue>
              {formatResult(results.totalCircumferenceFlatRoofs)} m
            </ResultValue>
          </ResultWrapper>
          <ResultWrapper>
            <ResultTitle>Percentage platte daken</ResultTitle>
            <ResultValue>{flatRoofPercentage()}%</ResultValue>
          </ResultWrapper>
        </div>
      </div>
      <Button variant="secondary" className="self-end" onClick={onClear}>
        Selecteer een nieuwe regio
      </Button>
    </div>
  );
};

const ResultWrapper: React.FC<WrapperProps> = ({ children }) => (
  <div className="mb-6">{children}</div>
);

const ResultTitle: React.FC<WrapperProps> = ({ children }) => (
  <p className="text-h3 text-secondary-text">{children}</p>
);

const ResultValue: React.FC<WrapperProps> = ({ children }) => (
  <p className="text-h1 leading-tight">{children}</p>
);

export default ModelResults;
