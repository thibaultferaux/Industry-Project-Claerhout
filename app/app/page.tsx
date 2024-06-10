"use client";

import Drawer from "@/components/Drawer";
import InfoStep, { FormValues } from "@/components/InfoStep";
import InteractiveMap from "@/components/InteractiveMap";
import ModelLoading from "@/components/ModelLoading";
import ModelResults from "@/components/ModelResults";
import ModelStatus from "@/components/ModelStatus";
import { getJob, startModel } from "@/lib/apiCalls";
import useJobStore from "@/lib/store";
import { Job, Location, ModelRequest } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Location states
  const [location, setLocation] = useState<Location | null>(null);
  const [scaleValue, setScaleValue] = useState<number>(2.5);
  const [viewport, setViewport] = useState({
    latitude: 50.82307,
    longitude: 3.32653,
    zoom: 11,
  });

  // Store states
  const { job, setJob, clearJob } = useJobStore();

  const mutation = useMutation({
    mutationFn: (body: ModelRequest) => startModel(body),
    onSuccess({ jobId }) {
      setJobId(jobId);
    },
  });

  const { data: jobData } = useQuery<Job | null>({
    queryKey: ["job", jobId ?? job?.id],
    queryFn: () => getJob(jobId ?? job!.id),
    enabled: (!!jobId || !!job) && job?.status !== "completed",
    refetchInterval: 10000,
    placeholderData: job ?? null,
  });

  // Set drawer open when job is present
  useEffect(() => {
    if (job) {
      initDrawerWithJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  // Update job state when jobData changes
  useEffect(() => {
    if (jobData) {
      setJob(jobData);
    }
  }, [jobData, setJob]);

  // Initialize drawer open when job is present
  const initDrawerWithJob = () => {
    setDrawerOpen(true);
    setJobId(null);

    // Set location and scale value
    if (!location) {
      setViewport({
        latitude: job!.coordinates[0],
        longitude: job!.coordinates[1],
        zoom: 11,
      });
      setLocation({
        latitude: job!.coordinates[0],
        longitude: job!.coordinates[1],
      });
      setScaleValue(job!.radius / 1000);
    }
  };

  // Handle select location
  const handleSelect = useCallback(() => {
    setJobId(null);
    clearJob();
    setDrawerOpen(true);
  }, [clearJob]);

  // Handle submit start model
  const handleSubmit: SubmitHandler<FormValues> = ({ email }) => {
    if (!location) return;

    mutation.mutate({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: Math.floor(scaleValue * 1000),
      email,
    });
  };

  const fakeJob: Job = {
    id: "abc123",
    status: "completed",
    email: "user@example.com",
    coordinates: [51.2194, 4.4025], // Coordinates for Antwerp, Belgium
    radius: 50,
    createdAt: "2023-01-01T12:00:00Z",
    totalImages: 100,
    imagesProcessed: 100,
    totalFlatRoofs: 10,
    totalSlopedRoofs: 5,
    totalSurfaceAreaFlatRoofs: 500.25,
    totalSurfaceAreaSlopedRoofs: 300.75,
    totalCircumferenceFlatRoofs: 200.5,
    ratioFlatRoofs: 0.67,
  };

  // Handle clear results
  const handleClear = useCallback(() => {
    setJobId(null);
    clearJob();
    setDrawerOpen(false);
  }, [clearJob]);

  // Render correct component based on status of the process
  const renderDrawerContent = () => {
    if (mutation.isPending) {
      return <ModelLoading />;
    }
    if (!job && !jobId) {
      return <InfoStep onSubmit={handleSubmit} />;
    }
    if (job?.status === "completed") {
      return <ModelResults results={job} onClear={handleClear} />;
    }
    return <ModelStatus status={job ? job.status : "generating"} />;
  };

  // Check if the process is loading
  const isLoading = () => {
    return (
      mutation.isPending ||
      !!jobId ||
      (!!job && (job.status === "generating" || job.status === "processing"))
    );
  };

  // Show error message when mutation is error
  // TODO: Create error component
  if (mutation.isError) {
    console.error(mutation.error);
    return <div>Error</div>;
  }

  return (
    <div className="relative h-full overflow-hidden">
      <Drawer open={drawerOpen} className="bg-white">
        {renderDrawerContent()}
      </Drawer>
      <InteractiveMap
        location={location}
        setLocation={setLocation}
        scaleValue={scaleValue}
        setScaleValue={setScaleValue}
        viewport={viewport}
        setViewport={setViewport}
        drawerOpen={drawerOpen}
        onSelect={handleSelect}
        loading={isLoading()}
      />
    </div>
  );
}
