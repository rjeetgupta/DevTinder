import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Module 1 design-system playground.
 * Not a real route yet — just verifies the dark/glass theme, fonts,
 * and shadcn-style primitives render correctly before feature work
 * (auth, feed, chat, ...) starts in later modules.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="brand-gradient-text">DevTinder</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Module 1 — scaffolding &amp; design system check
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Theme playground</CardTitle>
          <CardDescription>
            Dark, glassy surfaces with a violet → coral accent.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Real routes (login, feed, chat…) begin in Module 4 onward.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
