"use client";

import Drawer from "@/components/Drawer";
import InfoStep from "@/components/InfoStep";
import InteractiveMap from "@/components/InteractiveMap";
import ModelLoading from "@/components/ModelLoading";
import ModelResults from "@/components/ModelResults";
import { Results } from "@/lib/types";
import { useState } from "react";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Results | null>(null);

  const handleSelect = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSubmit = () => {
    // Simulate loading
    setModelLoading(true);
    setTimeout(() => {
      setModelLoading(false);
      setResults({ flatRoofs: 426 });
    }, 5000);
  };

  const handleClear = () => {
    setResults(null);
    setDrawerOpen(false);
  };

  return (
    <div className="relative h-full overflow-hidden">
      <Drawer open={drawerOpen} className="bg-white">
        {modelLoading ? (
          <ModelLoading />
        ) : results ? (
          <ModelResults results={results} onClear={handleClear} />
        ) : (
          <InfoStep onSubmit={handleSubmit} />
        )}
      </Drawer>
      <InteractiveMap
        drawerOpen={drawerOpen}
        onSelect={handleSelect}
        loading={modelLoading}
      />
    </div>
  );
}
