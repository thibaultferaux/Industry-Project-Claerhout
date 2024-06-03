import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Job } from "./types";

interface JobStore {
  job: Job | null;
  setJob: (job: Job) => void;
  clearJob: () => void;
}

const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      job: null,
      setJob: (job: Job) => set({ job }),
      clearJob: () => set({ job: null }),
    }),

    {
      name: "roofradar-job-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useJobStore;
