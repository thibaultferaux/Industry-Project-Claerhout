import { GeocoderOptions } from "@mapbox/mapbox-gl-geocoder";
import { ControlPosition } from "react-map-gl";

export interface Location {
  longitude: number;
  latitude: number;
}

export type GeocoderControlProps = Omit<
  GeocoderOptions,
  "accessToken" | "mapboxgl" | "marker"
> & {
  mapboxAccessToken: string;
  location: Location | null;
  setLocation: (location: Location | null) => void;

  position: ControlPosition;
};

export interface ModelRequest {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface ModelResponse {
  message: string;
  jobId: string;
}

type Status = "error" | "generating" | "processing" | "completed";

export interface Job {
  id: string;
  status: Status;
  coordinates: [number, number];
  radius: number;
  createdAt: Date;
  totalImages: number;
  imagesProcessed: number;
  totalFlatRoofs: number;
  totalSlopedRoofs: number;
  totalSurfaceAreaFlatRoofs: number;
  totalSurfaceAreaSlopedRoofs: number;
  totalCircumferenceFlatRoofs: number;
}
