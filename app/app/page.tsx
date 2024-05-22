"use client";

import Drawer from "@/components/Drawer";
import InfoStep from "@/components/InfoStep";
import InteractiveMap from "@/components/InteractiveMap";
import { useState } from "react";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleSelect = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSubmit = () => {
    console.log("Submitted");
  };

  return (
    <div className="flex h-full">
      <Drawer open={drawerOpen} className="bg-white">
        <InfoStep onSubmit={handleSubmit} />
      </Drawer>
      <InteractiveMap onSelect={handleSelect} />
    </div>
  );
}
