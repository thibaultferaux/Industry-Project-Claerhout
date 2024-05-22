"use client";

import Image from "next/image";
import Button from "./Button";
import Scale from "./Scale";
import { useState } from "react";
import LocationInput from "./LocationInput";
import { cn } from "@/lib/utils";

interface InteractiveMapProps {
  drawerOpen: boolean;
  onSelect: () => void;
  loading?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  drawerOpen,
  onSelect,
  loading,
}) => {
  // const [viewport, setViewport] = useState({
  //   latitude: 37.7749,
  //   longitude: -122.4194,
  //   zoom: 11,
  // });

  const [scaleValue, setScaleValue] = useState<number>(10);
  const [locationValue, setLocationValue] = useState<string>("");

  // Options for the map
  // ReactMapGL
  // Leaflet

  return (
    <div
      className={cn(
        "h-full border-2 bg-slate-100 border-primary-orange relative p-4 transition-all duration-700 ease-out-quint ml-auto",
        { "w-2/3": drawerOpen, "w-full": !drawerOpen }
      )}
    >
      <Image
        src="/map-placeholder.png"
        alt="Placeholder map"
        layout="fill"
        className={cn("object-cover", {
          "opacity-80 cursor-not-allowed": loading,
        })}
        aria-disabled={loading}
      />
      {!loading && (
        <>
          <Button
            variant="primary"
            onClick={onSelect}
            className="absolute right-8 bottom-8"
          >
            Selecteer
          </Button>
          <Scale
            value={scaleValue}
            setValue={setScaleValue}
            min={1}
            max={20}
            className="absolute left-8 bottom-8 w-80"
          />
          <LocationInput
            value={locationValue}
            setValue={setLocationValue}
            className="absolute left-8 top-8 w-80"
          />
        </>
      )}
    </div>
  );
};

export default InteractiveMap;
