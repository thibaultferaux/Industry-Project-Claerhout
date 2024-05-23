import { kmToPixelsAtMaxZoom, metersToPixelsAtMaxZoom } from "@/lib/utils";
import { Feature } from "geojson";
import { CircleLayer, Layer, Source } from "react-map-gl";

interface RadiusProps {
  radius: number;
  longitude: number;
  latitude: number;
  zoom: number;
}

const Radius: React.FC<RadiusProps> = ({
  radius,
  longitude,
  latitude,
}) => {
  const geojson: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  };

  const layerStyle: CircleLayer = {
    id: "circle-layer",
    type: "circle",
    paint: {
      "circle-radius": {
        stops: [
          [0, 0],
          [20, metersToPixelsAtMaxZoom(radius * 100, latitude)],
        ],
        base: 2,
      },
      "circle-color": "#D4D4D4",
      "circle-opacity": 0.3,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#202020",
      "circle-stroke-opacity": 0.3,
    },
  };

  return (
    <Source id="circle-data" type="geojson" data={geojson}>
      <Layer {...layerStyle} />
    </Source>
  );
};

export default Radius;
