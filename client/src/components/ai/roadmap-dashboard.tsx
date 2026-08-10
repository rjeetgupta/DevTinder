import { GraduationCap, Sparkles, TrendingUp, Zap } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";
import { SiUdemy } from "react-icons/si";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Roadmap } from "@/types";

function openUdemy(title?: string) {
  if (!title) return;
  window.open(`https://www.udemy.com/courses/search/?q=${encodeURIComponent(title)}`, "_blank");
}

export function RoadmapDashboard({
  roadmap,
  onRegenerate,
  isRegenerating,
}: {
  roadmap: Roadmap;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="glass flex flex-col items-center justify-between gap-4 rounded-lg p-6 sm:flex-row">
        <div>
          <h1 className="text-h2">
            Your personal <span className="brand-gradient-text">action plan</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            We identified{" "}
            <span className="text-foreground font-semibold">
              {roadmap.mustHave.length} critical skills
            </span>{" "}
            missing from your arsenal.
          </p>
        </div>
        <Button variant="glass" size="sm" onClick={onRegenerate} disabled={isRegenerating}>
          <Sparkles className="size-4" /> Regenerate
        </Button>
      </div>

      {roadmap.mustHave.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-rose-500/15 p-3 text-rose-400">
              <Zap className="size-5" />
            </div>
            <div>
              <h2 className="text-h3">Immediate priority</h2>
              <p className="text-muted-foreground text-sm">
                Learn these to unlock 80% more opportunities.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roadmap.mustHave.map((item) => (
              <Card key={item.skill} className="gap-0 overflow-hidden p-0">
                <div className="brand-gradient h-1.5 w-full" />
                <CardContent className="flex flex-col gap-4 pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-h3">{item.skill}</h3>
                    <Badge className="bg-rose-500/20 text-rose-300">High impact</Badge>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-muted-foreground mb-1 text-[11px] font-semibold uppercase tracking-wide">
                      Why this matters
                    </p>
                    <p className="text-sm italic">&quot;{item.reason}&quot;</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {item.youtube?.url && (
                      <Button asChild variant="outline" size="sm">
                        <a href={item.youtube.url} target="_blank" rel="noreferrer">
                          <FaYoutube className="size-4 text-red-400" /> Free tutorial
                        </a>
                      </Button>
                    )}
                    {item.udemy?.title && (
                      <Button size="sm" onClick={() => openUdemy(item.udemy?.title)}>
                        <SiUdemy className="size-4" /> Full course
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-12">
        {roadmap.recommended.length > 0 && (
          <div className="md:col-span-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/15 p-3 text-primary">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <h2 className="text-h3">Career growth</h2>
                <p className="text-muted-foreground text-sm">
                  Skills that differentiate you from juniors.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {roadmap.recommended.map((item) => (
                <Card key={item.skill} className="p-4">
                  <CardContent className="p-0">
                    <h4 className="font-semibold">{item.skill}</h4>
                    <p className="text-muted-foreground mt-1 text-sm">{item.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {roadmap.goodToKnow.length > 0 && (
          <div className="md:col-span-4">
            <Card className="h-full">
              <CardContent>
                <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                  <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-400">
                    <GraduationCap className="size-4" />
                  </div>
                  <h2 className="text-h3">Bonus skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roadmap.goodToKnow.map((item) => (
                    <Badge key={item.skill} variant="glass" title={item.reason}>
                      {item.skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 flex gap-2 rounded-lg bg-primary/10 p-4">
                  <Sparkles className="size-4 shrink-0 text-primary" />
                  <p className="text-xs text-amber-200/80">
                    Pro tip: focus on Immediate Priority first — don&apos;t get overwhelmed!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
