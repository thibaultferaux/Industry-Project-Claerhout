import { useControl, ControlPosition } from "react-map-gl";
import MapboxGeocoder, { GeocoderOptions } from "@mapbox/mapbox-gl-geocoder";
import { Location } from "@/lib/types";
import { useEffect } from "react";

type GeocoderControlProps = Omit<
  GeocoderOptions,
  "accessToken" | "mapboxgl" | "marker"
> & {
  mapboxAccessToken: string;
  location: Location | null;
  setLocation: (location: Location | null) => void;

  position: ControlPosition;
};

export default function GeocoderControl(props: GeocoderControlProps) {
  const geocoder = useControl<MapboxGeocoder>(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false,
        accessToken: props.mapboxAccessToken,
      });
      ctrl.on("result", (evt) => {
        const { result } = evt;
        const resultLocation =
          result &&
          (result.center ||
            (result.geometry?.type === "Point" && result.geometry.coordinates));
        if (resultLocation) {
          props.setLocation({
            longitude: resultLocation[0],
            latitude: resultLocation[1],
          });
        } else {
          props.setLocation(null);
        }
      });

      return ctrl;
    },
    {
      position: "top-left",
    }
  );

  useEffect(() => {
    if (geocoder) {
      if (
        geocoder.getProximity() !== props.proximity &&
        props.proximity !== undefined
      ) {
        geocoder.setProximity(props.proximity);
      }
      if (
        geocoder.getRenderFunction() !== props.render &&
        props.render !== undefined
      ) {
        geocoder.setRenderFunction(props.render);
      }
      if (
        geocoder.getLanguage() !== props.language &&
        props.language !== undefined
      ) {
        geocoder.setLanguage(props.language);
      }
      if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
        geocoder.setZoom(props.zoom);
      }
      if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
        geocoder.setFlyTo(props.flyTo);
      }
      if (
        geocoder.getPlaceholder() !== props.placeholder &&
        props.placeholder !== undefined
      ) {
        geocoder.setPlaceholder(props.placeholder);
      }
      if (
        geocoder.getCountries() !== props.countries &&
        props.countries !== undefined
      ) {
        geocoder.setCountries(props.countries);
      }
      if (geocoder.getTypes() !== props.types && props.types !== undefined) {
        geocoder.setTypes(props.types);
      }
      if (
        geocoder.getMinLength() !== props.minLength &&
        props.minLength !== undefined
      ) {
        geocoder.setMinLength(props.minLength);
      }
      if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
        geocoder.setLimit(props.limit);
      }
      if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
        geocoder.setFilter(props.filter);
      }
      if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
        geocoder.setOrigin(props.origin);
      }
      if (
        geocoder.getAutocomplete() !== props.autocomplete &&
        props.autocomplete !== undefined
      ) {
        geocoder.setAutocomplete(props.autocomplete);
      }
      if (
        geocoder.getFuzzyMatch() !== props.fuzzyMatch &&
        props.fuzzyMatch !== undefined
      ) {
        geocoder.setFuzzyMatch(props.fuzzyMatch);
      }
    }
  }, [geocoder, props]);

  return null;
}
