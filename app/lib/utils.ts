import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert kilometers to pixels based on zoom level
export const kmToPixelsAtMaxZoom = (km: number, zoom: number) => {
  const earthCircumferenceInMeters = 40075017;
  const meters = km * 1000;
  const pixels = meters / earthCircumferenceInMeters / Math.pow(2, 20 - zoom);
  return pixels;
};

export const metersToPixelsAtMaxZoom = (meters: number, latitude: number) =>
  meters / (78271.484 / 2 ** 20) / Math.cos((latitude * Math.PI) / 180);
