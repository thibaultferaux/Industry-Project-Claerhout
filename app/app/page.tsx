"use client";

import Drawer from "@/components/Drawer";
import InfoStep from "@/components/InfoStep";
import InteractiveMap from "@/components/InteractiveMap";
import ModelLoading from "@/components/ModelLoading";
import ModelResults from "@/components/ModelResults";
import ModelStatus from "@/components/ModelStatus";
import { getJob, startModel } from "@/lib/apiCalls";
import useJobStore from "@/lib/store";
import { Job, Location, ModelRequest } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Store states
  const { job, setJob, clearJob } = useJobStore();

  // Location states
  const [location, setLocation] = useState<Location | null>(null);
  const [scaleValue, setScaleValue] = useState<number>(2.5);
  const [viewport, setViewport] = useState({
    latitude: 50.82307,
    longitude: 3.32653,
    zoom: 11,
  });

  const mutation = useMutation({
    mutationFn: (body: ModelRequest) => startModel(body),
    onSuccess({ jobId }) {
      setJobId(jobId);
    },
  });

  const { data: jobData} = useQuery<Job | null>({
    queryKey: ["job", jobId ?? job?.id],
    queryFn: () => getJob(jobId ?? job!.id),
    enabled: (!!jobId || !!job) && (job?.status !== "completed"),
    refetchInterval: 10000,
    placeholderData: job ?? null,
  });

  // Set drawer open when job is present
  useEffect(() => {
    if (job) {
      setDrawerOpen(true);
      setJobId(null);
      // Set location and scale value when job is present
      if (!location) {
        setViewport({ latitude: job.coordinates[0], longitude: job.coordinates[1], zoom: 11 });
        setLocation({ latitude: job.coordinates[0], longitude: job.coordinates[1] });
        setScaleValue(job.radius / 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job])

  // Update job state when jobData changes
  useEffect(() => {
    if (jobData) {
      setJob(jobData);
    }
  }, [jobData, setJob])

  // Handle select location
  const handleSelect = () => {
    setJobId(null);
    clearJob();
    setDrawerOpen(true);
  };

  // Handle submit start model
  const handleSubmit = () => {
    if (!location) return;

    mutation.mutate({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: Math.floor(scaleValue * 1000),
    });
  };

  // Handle clear results
  const handleClear = () => {
    setJobId(null);
    clearJob();
    setDrawerOpen(false);
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
        {mutation.isPending ? (
          <ModelLoading />
        ) : (!job && !jobId) ? (
          <InfoStep onSubmit={handleSubmit} />
        ) : job?.status === "completed" ? (
          <ModelResults results={job} onClear={handleClear} />
        ) : (
          <ModelStatus status={job ? job.status : "generating"} />
        )}
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
        loading={mutation.isPending || !!jobId || (!!job && (job.status === "generating" || job.status === "processing"))}
      />
    </div>
  );
}
