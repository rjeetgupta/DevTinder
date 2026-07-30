import Link from "next/link";
import { Compass } from "lucide-react";

import { NodeMark } from "@/components/brand/node-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <NodeMark className="size-10" />
      <Compass className="text-primary size-10" />
      <h1 className="text-h1">Page not found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to DevTinder</Link>
      </Button>
    </main>
  );
}
