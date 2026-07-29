"use client";

import { Radar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

export default function FeedPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <Card className="max-w-md text-center">
        <CardHeader>
          <Radar className="text-primary mx-auto size-8" />
          <CardTitle className="mt-2">You&apos;re logged in, {user?.firstName}!</CardTitle>
          <CardDescription>
            The real swipe feed is built in Module 6. This screen just proves the
            auth flow, route guard, and app shell work end to end.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
