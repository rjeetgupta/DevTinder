"use client";

import { useState } from "react";
import { Check, Lock, MessageCircle, RotateCcw, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PREMIUM_FEATURES } from "@/lib/constants/premium-features";

const SILVER_PERKS = [
  { icon: Sparkles, text: "AI Career Coach", highlight: true },
  { icon: Check, text: "Blue Verified Badge" },
  { icon: RotateCcw, text: "View & Restore Ignored Profiles" },
  { icon: Check, text: "100 Connection Requests Per Day" },
  { icon: MessageCircle, text: "Chat With Anyone (No Match Needed)" },
  { icon: Check, text: "Search For Specific Users & Skills" },
];

export function PlanCards({
  onSelectPlan,
  isSubmitting,
}: {
  onSelectPlan: (plan: "silver") => void;
  isSubmitting: boolean;
}) {
  const [benefitsOpen, setBenefitsOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-h1">Upgrade your experience</h1>
        <p className="text-muted-foreground mt-2">
          Select a plan to unlock the full potential of DevTinder.
        </p>
        <button
          type="button"
          onClick={() => setBenefitsOpen(true)}
          className="text-primary mt-2 text-sm hover:underline"
        >
          View all premium benefits
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Silver — active plan */}
        <Card className="border-primary/20 glow-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-h3">Silver Membership</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">Unlock AI & networking</p>
              </div>
              <Badge>Best seller</Badge>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold">₹199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {SILVER_PERKS.map(({ icon: Icon, text, highlight }) => (
                <li
                  key={text}
                  className={`flex items-center gap-3 text-sm ${
                    highlight ? "bg-white/5 rounded-lg p-2 font-semibold" : ""
                  }`}
                >
                  <Icon className={highlight ? "text-primary size-4" : "text-primary size-4"} />
                  {text}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              disabled={isSubmitting}
              onClick={() => onSelectPlan("silver")}
              className="mt-2"
            >
              Get Silver Premium
            </Button>
          </CardContent>
        </Card>

        {/* Gold — coming soon */}
        <Card className="relative opacity-80">
          <Badge variant="outline" className="absolute top-4 right-4 gap-1">
            <Lock className="size-3" /> Coming soon
          </Badge>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-muted-foreground text-h3">Gold Pro Edition</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  Ultimate career acceleration
                </p>
              </div>
              <Star className="text-muted-foreground size-6" />
            </div>
            <div className="mt-4">
              <span className="text-muted-foreground text-4xl font-extrabold">₹499</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="text-muted-foreground flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-3">
                <Sparkles className="size-4" /> AI Resume Reviewer (upload & scan)
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="size-4" /> AI Mock Interview Bot (voice enabled)
              </li>
              <li className="flex items-center gap-3">
                <Star className="size-4" /> 1-on-1 Mentorship Credits
              </li>
              <li className="text-muted-foreground/70 pt-1 text-xs font-semibold uppercase tracking-wide">
                Includes all Silver features
              </li>
            </ul>
            <Button size="lg" disabled className="mt-2">
              Join Waitlist
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={benefitsOpen} onOpenChange={setBenefitsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary size-5" /> Premium benefits
            </DialogTitle>
            <DialogDescription>Take your career to the next level.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {PREMIUM_FEATURES.map((feature) => (
              <div key={feature.title} className="glass rounded-lg p-4">
                <div className="mb-1 text-2xl">{feature.icon}</div>
                <h4 className="text-sm font-semibold">{feature.title}</h4>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
