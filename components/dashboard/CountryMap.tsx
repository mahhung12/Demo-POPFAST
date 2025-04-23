import React from "react";
import { worldMill } from "@react-jvectormap/world";
import dynamic from "next/dynamic";

const VectorMap = dynamic(() => import("@react-jvectormap/core").then((mod) => mod.VectorMap), { ssr: false });

type MarkerStyle = {
  initial: {
    fill: string;
    r: number; // Radius for markers
  };
};
interface CountryMapProps {
  mapColor?: string;
  markers?: {
    latLng: [number, number];
    name: string;
    style?: {
      fill: string;
      borderWidth: number;
      borderColor: string;
    };
  }[];
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor, markers = [] }) => {
  const markersValues = markers.map((marker) => ({
    latLng: marker.latLng,
    name: marker.name,
    style: {
      fill: marker.style?.fill || "#465FFF",
      borderWidth: marker.style?.borderWidth || 1,
      borderColor: marker.style?.borderColor || "#000",
    },
  }));
  console.log("Markers Values:", markersValues);
  console.log("Markers Values:", markersValues);

  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markers={markers} // Pass the markers directly
      markerStyle={
        {
          initial: {
            fill: "#465FFF",
            r: 4, // Custom radius for markers
          }, // Type assertion to bypass strict CSS property checks
        } as MarkerStyle
      }
      zoomOnScroll={true}
      zoomMin={0.5}
      zoomMax={12}
      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          stroke: "none",
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#465FFF",
        },
      }}
    />
  );
};

export default CountryMap;
