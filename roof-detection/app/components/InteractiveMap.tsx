"use client";

import Image from "next/image";
import Button from "./Button";
import Scale from "./Scale";
import { useState } from "react";

const InteractiveMap = () => {
  // const [viewport, setViewport] = useState({
  //   latitude: 37.7749,
  //   longitude: -122.4194,
  //   zoom: 11,
  // });

  const [scaleValue, setScaleValue] = useState<number>(10);

  // Options for the map
  // ReactMapGL
  // Leaflet

  return (
    <div className="w-full h-full border-2 bg-slate-100 border-primary-orange relative p-4">
      <Image
        src="/map-placeholder.png"
        alt="Placeholder map"
        layout="fill"
        className="object-cover"
      />
      <Button
        variant="primary"
        onClick={() => console.log("Clicked")}
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
    </div>
  );
};

export default InteractiveMap;
