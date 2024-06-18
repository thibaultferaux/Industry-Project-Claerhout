import ResultHistoryContent from "@/components/ResultHistoryContent";
import { Suspense } from "react";

export default function ResultHistory() {
  return (
    <div className="w-full">
      <h2 className="text-h2 mb-4 md:mb-6">Vorige resultaten</h2>
      <div className="flex flex-col space-y-4 pb-24">
        <Suspense fallback={null}>
          <ResultHistoryContent />
        </Suspense>
      </div>
    </div>
  );
}
