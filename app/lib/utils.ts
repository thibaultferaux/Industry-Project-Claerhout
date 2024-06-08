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

export const formatResult = (value: number) => {
  const roundedValue = Math.round(value);
  // Set a space as thousands separator
  return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const formatFloat = (value: string) => {
  return value.replace(".", ",");
};

// Define an array with Dutch month names
const dutchMonths: string[] = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = dutchMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
