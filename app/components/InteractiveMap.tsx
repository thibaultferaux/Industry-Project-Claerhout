"use client";

import Button from "./Button";
import Scale from "./Scale";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  GeolocateControl,
  Layer,
  Map,
  MapRef,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import GeocoderControl from "./MapControl/GeocoderControl";
import { Location } from "@/lib/types";
import { MapLayerMouseEvent } from "mapbox-gl";
import Pin from "./Icons/Pin";
import Radius from "./MapControl/Radius";

interface InteractiveMapProps {
  location: Location | null;
  setLocation: (location: Location | null) => void;
  scaleValue: number;
  setScaleValue: (scaleValue: number) => void;
  drawerOpen: boolean;
  onSelect: () => void;
  loading?: boolean;
  clearResults: () => void;
}

const TOKEN = process.env.MAPBOX_TOKEN;

if (!TOKEN) {
  throw new Error("Missing Mapbox token");
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  location,
  setLocation,
  scaleValue,
  setScaleValue,
  drawerOpen,
  onSelect,
  loading,
}) => {
  const [viewport, setViewport] = useState({
    latitude: 50.82307,
    longitude: 3.32653,
    zoom: 11,
  });

  const mapRef = useRef<MapRef | null>(null);

  const handleClick = (evt: MapLayerMouseEvent) => {
    const { lngLat } = evt;
    setLocation({
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    });
  };

  return (
    <div
      className={cn(
        "h-full border-2 bg-slate-100 border-primary-orange relative transition-all duration-700 ease-out-quint ml-auto",
        { "w-2/3": drawerOpen, "w-full": !drawerOpen }
      )}
    >
      <Map
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        mapboxAccessToken={TOKEN}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/thibaultferaux/clwhuuy0900pi01qs0jx895rk"
        onClick={handleClick}
        ref={mapRef}
      >
        {location && (
          <>
            <Marker
              longitude={location.longitude}
              latitude={location.latitude}
              anchor="bottom"
            >
              <Pin className="h-10 w-10" />
            </Marker>
            <Radius
              {...location}
              radius={scaleValue * 10}
              zoom={viewport.zoom}
            />
          </>
        )}
        {!loading && (
          <>
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
          </>
        )}
      </Map>
      {!loading ? (
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
            min={0.1}
            max={5.0}
            className="absolute left-8 bottom-8 w-80"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-white bg-opacity-30 cursor-not-allowed" />
      )}
    </div>
  );
};

export default InteractiveMap;
