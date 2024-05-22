import { GeocoderOptions } from "@mapbox/mapbox-gl-geocoder";
import { ControlPosition } from "react-map-gl";

export interface Results {
  flatRoofs: number;
}

export interface Location{
  longitude: number;
  latitude: number;
};

export type GeocoderControlProps = Omit<
  GeocoderOptions,
  "accessToken" | "mapboxgl" | "marker"
> & {
  mapboxAccessToken: string;
  location: Location | null;
  setLocation: (location: Location | null) => void;

  position: ControlPosition;
};
