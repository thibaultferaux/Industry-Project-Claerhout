"use client";

import Drawer from "@/components/Drawer";
import InfoStep from "@/components/InfoStep";
import InteractiveMap from "@/components/InteractiveMap";
import ModelLoading from "@/components/ModelLoading";
import ModelResults from "@/components/ModelResults";
import { startModel } from "@/lib/apiCalls";
import { Location, ModelRequest, Results } from "@/lib/types";
import { Mutation, useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [results, setResults] = useState<Results | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  // Location states
  const [location, setLocation] = useState<Location | null>(null);
  const [scaleValue, setScaleValue] = useState<number>(10);

  const mutation = useMutation({
    mutationFn: (body: ModelRequest) => startModel(body),
  });

  const handleSelect = () => {
    setResults(null);
    setDrawerOpen(true);
  };

  const handleSubmit = () => {
    if (!location) return;

    mutation.mutate({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: scaleValue,
    });
  };

  const handleClear = () => {
    setResults(null);
    setDrawerOpen(false);
  };

  if (mutation.isError) {
    console.error(mutation.error);
    return <div>Error</div>;
  }

  return (
    <div className="relative h-full overflow-hidden">
      <Drawer open={drawerOpen} className="bg-white">
        {/* {mutation.isPending ? (
          <ModelLoading />
        ) : results ? (
          <ModelResults results={results} onClear={handleClear} />
        ) : (
          <InfoStep onSubmit={handleSubmit} />
        )} */}
        {mutation.isPending ? (
          <ModelLoading />
        ) : mutation.isSuccess ? (
          <div>jobId: {mutation.data?.jobId}</div>
        ) : (
          <InfoStep onSubmit={handleSubmit} />
        )}
      </Drawer>
      <InteractiveMap
        location={location}
        setLocation={setLocation}
        scaleValue={scaleValue}
        setScaleValue={setScaleValue}
        drawerOpen={drawerOpen}
        onSelect={handleSelect}
        loading={mutation.isPending}
        clearResults={handleClear}
      />
    </div>
  );
}
