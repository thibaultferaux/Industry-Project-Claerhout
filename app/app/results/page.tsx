import { getJobs } from "@/lib/apiCalls";
import { Job } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function ResultHistory() {
  // const { data } = useQuery<Job[]>({
  //   queryKey: ["jobs"],
  //   queryFn: () => getJobs(),
  // });

  return (
    <div className="w-full">
      <h2 className="text-h2 mb-4">Vorige resultaten</h2>
    </div>
  );
}
