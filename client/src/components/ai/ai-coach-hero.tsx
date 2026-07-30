import { Flame, Loader2, Rocket, Sparkles, TrendingUp, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HIGHLIGHTS = [
  { icon: Flame, title: "Hot skills", desc: "Target what's in demand", color: "text-red-400" },
  { icon: TrendingUp, title: "Career growth", desc: "Salary optimization", color: "text-emerald-400" },
  { icon: Terminal, title: "Resource finder", desc: "Curated tutorials", color: "text-blue-400" },
];

export function AiCoachHero({
  onGenerate,
  isLoading,
}: {
  onGenerate: () => void;
  isLoading: boolean;
}) {
  return (
    <Card className="mx-auto grid max-w-4xl overflow-hidden p-0 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-5 p-8 md:p-10">
        <span className="border-primary/30 text-primary inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <Sparkles className="size-3.5" /> AI-powered career coach
        </span>
        <h1 className="text-h1 leading-tight">
          Level up your <span className="brand-gradient-text">tech stack</span>
        </h1>
        <p className="text-muted-foreground">
          Don&apos;t guess what to learn next. Let AI analyze your profile and build a custom
          curriculum to get you hired.
        </p>
        <Button size="lg" onClick={onGenerate} disabled={isLoading} className="w-fit">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Rocket className="size-4" />
          )}
          Generate my roadmap
        </Button>
      </div>

      <div className="bg-black/30 flex flex-col justify-center gap-3 p-8 md:p-10">
        {HIGHLIGHTS.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="glass flex items-center gap-4 rounded-xl p-4">
            <div className={`rounded-lg bg-white/5 p-3 ${color}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
