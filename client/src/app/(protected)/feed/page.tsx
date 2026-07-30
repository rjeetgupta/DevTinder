"use client";

import { useEffect } from "react";
import { Radar, RefreshCw } from "lucide-react";

import { FeedCard } from "@/components/feed/feed-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFeed } from "@/store/slices/feedSlice";

function FeedSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass flex flex-col items-center gap-4 rounded-xl p-6">
          <Skeleton className="size-28 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  useDocumentTitle("Discover");
  const dispatch = useAppDispatch();
  const { users, status, error } = useAppSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 pb-10 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h2">Discover</h1>
          <p className="text-muted-foreground text-sm">
            Developers you haven&apos;t connected with yet.
          </p>
        </div>
        <Button
          variant="glass"
          size="sm"
          onClick={() => dispatch(fetchFeed())}
          disabled={status === "loading"}
        >
          <RefreshCw className={status === "loading" ? "size-4 animate-spin" : "size-4"} />
          Refresh
        </Button>
      </div>

      {status === "loading" && users.length === 0 && <FeedSkeletonGrid />}

      {status === "failed" && (
        <div className="glass flex flex-col items-center gap-3 rounded-xl p-10 text-center">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={() => dispatch(fetchFeed())}>
            Try again
          </Button>
        </div>
      )}

      {status === "succeeded" && users.length === 0 && (
        <div className="glass flex flex-col items-center gap-3 rounded-xl p-16 text-center">
          <Radar className="text-primary size-10" />
          <h2 className="text-h3">You&apos;re all caught up</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            No new developers to show right now — check back later, or refresh to look again.
          </p>
        </div>
      )}

      {users.length > 0 && (
        <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 sm:place-items-stretch xl:grid-cols-3">
          {users.map((user) => (
            <FeedCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
