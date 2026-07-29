"use client";

import { Radar, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { NodeField, NodeMark } from "@/components/brand/node-mark";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback, AvatarStatus } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

/**
 * Module 2 design-system showcase.
 * Not a real route — exercises every primitive + the app shell before
 * real pages (feed, chat, ...) are wired up starting Module 4.
 */
export default function Home() {
  return (
    <AppShell activeHref="/feed" userName="Ada" unreadCount={3}>
      <div className="flex flex-col gap-8 p-2 pb-10">
        {/* Hero / typography */}
        <section className="glass relative overflow-hidden rounded-xl p-8">
          <NodeField className="text-primary" />
          <div className="relative flex items-center gap-3">
            <NodeMark className="size-8" />
            <span className="text-kicker">Design system — Module 2</span>
          </div>
          <h1 className="text-display relative mt-3 max-w-lg">
            Find developers worth <span className="brand-gradient-text">connecting</span>{" "}
            with.
          </h1>
          <p className="text-muted-foreground relative mt-3 max-w-md text-sm">
            Dense, dark, glassy — built for scanning profiles fast, not for
            scrolling a marketing page.
          </p>
        </section>

        {/* Typography scale */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Tight display type, wide-tracked kickers.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-display">Display heading</p>
            <p className="text-h1">Heading 1</p>
            <p className="text-h2">Heading 2</p>
            <p className="text-h3">Heading 3 — subhead weight</p>
            <p className="text-sm">
              Body text sits at 14px, the density this app is built around.
            </p>
            <p className="text-kicker">Section kicker label</p>
            <p className="text-stat text-2xl">1,204 matches</p>
          </CardContent>
        </Card>

        {/* Buttons + badges */}
        <Card>
          <CardHeader>
            <CardTitle>Actions &amp; status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Button>
                <Sparkles /> Send request
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="glass">Glass</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Ignore</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Premium</Badge>
              <Badge variant="secondary">New match</Badge>
              <Badge variant="outline">React</Badge>
              <Badge variant="glass">TypeScript</Badge>
              <Badge variant="online">
                <span className="status-dot online" /> Online now
              </Badge>
              <Badge variant="destructive">Expired</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form primitives */}
        <Card>
          <CardHeader>
            <CardTitle>Form primitives</CardTitle>
          </CardHeader>
          <CardContent className="grid max-w-md gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="ds-name">Display name</Label>
              <Input id="ds-name" placeholder="Ada Lovelace" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ds-bio">Bio</Label>
              <Textarea id="ds-bio" placeholder="Building distributed systems…" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ds-skill">Primary skill</Label>
              <Select defaultValue="react">
                <SelectTrigger id="ds-skill">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="node">Node.js</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="glass"
              size="sm"
              onClick={() => toast.success("Profile updated")}
            >
              Trigger toast
            </Button>
          </CardFooter>
        </Card>

        {/* Avatars + tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars &amp; tabs</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar>
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <AvatarStatus online />
              </div>
              <div className="relative">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <AvatarStatus />
              </div>
            </div>
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="text-muted-foreground text-sm">
                Full-stack developer, 6 years experience, based in Bengaluru.
              </TabsContent>
              <TabsContent value="skills" className="text-muted-foreground text-sm">
                React, TypeScript, Node.js, PostgreSQL.
              </TabsContent>
              <TabsContent value="activity" className="text-muted-foreground text-sm">
                Sent 3 requests this week.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Loading state */}
        <Card>
          <CardHeader>
            <CardTitle>Loading state</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
          <CardFooter>
            <Separator className="my-2" />
          </CardFooter>
        </Card>

        <div className="flex items-center gap-2 text-xs">
          <Radar className="text-muted-foreground size-3.5" />
          <span className="text-muted-foreground">
            Real routes (login, feed, chat…) begin in Module 4 onward.
          </span>
        </div>
      </div>
    </AppShell>
  );
}
