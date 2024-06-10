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

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface InteractiveMapProps {
  location: Location | null;
  setLocation: (location: Location | null) => void;
  scaleValue: number;
  setScaleValue: (scaleValue: number) => void;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  drawerOpen: boolean;
  onSelect: () => void;
  loading?: boolean;
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
  viewport,
  setViewport,
  drawerOpen,
  onSelect,
  loading,
}) => {
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
        {
          "hidden lg:block lg:w-[55%] xl:w-3/5 2xl:2/3": drawerOpen,
          "block w-full": !drawerOpen,
        }
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
            {typeof window !== "undefined" && window.innerWidth >= 768 && (
              <>
                <NavigationControl />
                <GeolocateControl />
              </>
            )}
          </>
        )}
      </Map>
      {!loading ? (
        <div className="absolute left-2 bottom-8 right-2 space-y-3 md:left-8 md:bottom-8 md:right-8 md:flex md:justify-between md:items-end">
          <Scale
            value={scaleValue}
            setValue={setScaleValue}
            min={0.1}
            max={5.0}
            className="w-full md:w-60 xl:w-80 transition-all duration-500 ease-out-quint"
          />
          <Button
            variant="primary"
            onClick={onSelect}
            className="w-full md:w-auto"
            disabled={!location}
          >
            Selecteer
          </Button>
        </div>
      ) : (
        <div className="absolute inset-0 bg-white bg-opacity-30 cursor-not-allowed" />
      )}
    </div>
  );
};

export default InteractiveMap;
