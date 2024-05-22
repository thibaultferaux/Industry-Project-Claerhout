"use client";

import Button from "./Button";
import Scale from "./Scale";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
} from "react-map-gl";
import GeocoderControl from "./MapControl/GeocoderControl";
import { GeocoderControlProps, Location } from "@/lib/types";

interface InteractiveMapProps {
  drawerOpen: boolean;
  onSelect: () => void;
  loading?: boolean;
}

const TOKEN = process.env.MAPBOX_TOKEN;

if (!TOKEN) {
  throw new Error("Missing Mapbox token");
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  drawerOpen,
  onSelect,
  loading,
}) => {
  const [viewport, setViewport] = useState({
    latitude: 50.82307,
    longitude: 3.32653,
    zoom: 11,
  });

  const [scaleValue, setScaleValue] = useState<number>(10);
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <div
      className={cn(
        "h-full border-2 bg-slate-100 border-primary-orange relative transition-all duration-700 ease-out-quint ml-auto",
        { "w-2/3": drawerOpen, "w-full": !drawerOpen }
      )}
    >
      {/* <Image
        src="/map-placeholder.png"
        alt="Placeholder map"
        layout="fill"
        className={cn("object-cover", {
          "opacity-80 cursor-not-allowed": loading,
        })}
        aria-disabled={loading}
      /> */}
      <Map
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        mapboxAccessToken={TOKEN}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/thibaultferaux/clwhuuy0900pi01qs0jx895rk"
      >
        {location && (
          <Marker
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
          />
        )}
        <GeocoderControl
          mapboxAccessToken={TOKEN}
          position="top-left"
          location={location}
          setLocation={setLocation}
          autocomplete
          language="nl"
          fuzzyMatch
        />
        <NavigationControl />
        <GeolocateControl />
      </Map>
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
          {/* <LocationInput
            value={locationValue}
            setValue={setLocationValue}
            className="absolute left-8 top-8 w-80"
          /> */}
        </>
      )}
    </div>
  );
};

export default InteractiveMap;
