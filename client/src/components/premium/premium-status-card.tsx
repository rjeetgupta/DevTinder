import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PremiumStatusCard({ membershipType }: { membershipType?: string | null }) {
  return (
    <Card className="border-secondary/30 mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className="bg-secondary/20 flex size-16 items-center justify-center rounded-full">
          <Crown className="text-secondary size-8" />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-center gap-2">
            <h2 className="text-h2">{membershipType ? `${membershipType} Premium` : "Premium"}</h2>
            <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            You&apos;re enjoying full access to all premium features.
          </p>
        </div>
        <Button asChild>
          <Link href="/ai-coach">
            <Sparkles className="size-4" /> Launch AI Coach
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
