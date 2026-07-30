"use client";

import { useEffect } from "react";
import { Users2 } from "lucide-react";

import { ConnectionCard } from "@/components/connections/connection-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchConnections } from "@/store/slices/connectionSlice";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass flex items-center gap-4 rounded-xl p-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ConnectionsPage() {
  useDocumentTitle("Connections");
  const dispatch = useAppDispatch();
  const { connections, status, error } = useAppSelector((state) => state.connections);

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4 pb-10 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-h2">My connections</h1>
        {connections.length > 0 && <Badge>{connections.length}</Badge>}
      </div>

      {status === "loading" && connections.length === 0 && <ListSkeleton />}

      {status === "failed" && <p className="text-destructive text-sm">{error}</p>}

      {status === "succeeded" && connections.length === 0 && (
        <div className="glass flex flex-col items-center gap-3 rounded-xl p-16 text-center">
          <Users2 className="text-primary size-10" />
          <h2 className="text-h3">No connections yet</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            It looks quiet here. Keep exploring the feed to connect with more developers!
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {connections.map((connection) => (
          <ConnectionCard key={connection._id} connection={connection} />
        ))}
      </div>
    </div>
  );
}
