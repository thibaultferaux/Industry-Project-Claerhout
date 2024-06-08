"use client";

import HistoryResult from "@/components/HistoryResult";
import { getJobs } from "@/lib/apiCalls";
import { Job } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function ResultHistory() {
  const { data, isPending, isError } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => getJobs(),
  });

  const content = () => {
    if (isPending || isError) return null;
    if (data?.length === 0)
      return (
        <p className="text-center text-secondary-text text-opacity-60 pt-12">
          Er zijn nog geen resultaten om te tonen
        </p>
      );
    if (data) {
      console.log(data);
      return data.map((job) => <HistoryResult result={job} key={job.id} />);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-h2 mb-8">Vorige resultaten</h2>
      <div className="flex flex-col space-y-4 pb-24">{content()}</div>
    </div>
  );
}
