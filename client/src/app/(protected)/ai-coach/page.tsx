"use client";

import { toast } from "sonner";

import { AiCoachHero } from "@/components/ai/ai-coach-hero";
import { RoadmapDashboard } from "@/components/ai/roadmap-dashboard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { generateRoadmap } from "@/store/slices/aiSlice";

export default function AiCoachPage() {
  useDocumentTitle("AI Coach");
  const dispatch = useAppDispatch();
  const { roadmap, status } = useAppSelector((state) => state.ai);
  const isLoading = status === "loading";

  const handleGenerate = async () => {
    const result = await dispatch(generateRoadmap());
    if (generateRoadmap.fulfilled.match(result)) {
      toast.success("Roadmap generated successfully!");
    } else {
      toast.error((result.payload as string) ?? "Could not generate roadmap.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 pb-10 sm:p-6">
      {roadmap ? (
        <RoadmapDashboard roadmap={roadmap} onRegenerate={handleGenerate} isRegenerating={isLoading} />
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center">
          <AiCoachHero onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
