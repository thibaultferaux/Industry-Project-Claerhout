"use client";

import { getJobs } from "@/lib/apiCalls";
import { Job } from "@/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import HistoryResult from "./HistoryResult";

const ResultHistoryContent = () => {
  const { data, isPending, isError } = useSuspenseQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => getJobs(),
  });


  if (isPending || isError) return null;

  if (data?.length === 0) {
    return (
      <p className="text-center text-secondary-text text-opacity-60 pt-12">
        Er zijn nog geen resultaten om te tonen
      </p>
    );
  }

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {data.map((job) => (
        <HistoryResult result={job} key={job.id} />
      ))}
    </div>
  );
};

export default ResultHistoryContent;
