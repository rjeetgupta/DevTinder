"use client";

import { useEffect } from "react";
import { Inbox, UserX } from "lucide-react";

import { IgnoredUserCard } from "@/components/requests/ignored-user-card";
import { RequestCard } from "@/components/requests/request-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIgnoredUsers, fetchReceivedRequests } from "@/store/slices/requestSlice";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass flex items-center gap-4 rounded-lg p-4">
          <Skeleton className="size-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: {
  icon: typeof Inbox;
  title: string;
  description: string;
}) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-lg p-16 text-center">
      <Icon className="text-primary size-10" />
      <h2 className="text-h3">{title}</h2>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
    </div>
  );
}

export default function RequestsPage() {
  useDocumentTitle("Requests");
  const dispatch = useAppDispatch();
  const { received, receivedStatus, receivedError, ignored, ignoredStatus, ignoredError } =
    useAppSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchReceivedRequests());
  }, [dispatch]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4 pb-10 sm:p-6">
      <h1 className="text-h2 mb-6">Connection requests</h1>

      <Tabs
        defaultValue="received"
        onValueChange={(value) => {
          if (value === "ignored" && ignoredStatus === "idle") {
            dispatch(fetchIgnoredUsers());
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="received">
            Received
            {received.length > 0 && <Badge className="ml-1.5 h-5 px-1.5">{received.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="ignored">Ignored</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4">
          {receivedStatus === "loading" && received.length === 0 && <ListSkeleton />}
          {receivedStatus === "failed" && (
            <p className="text-destructive text-sm">{receivedError}</p>
          )}
          {receivedStatus === "succeeded" && received.length === 0 && (
            <EmptyState
              icon={Inbox}
              title="No pending requests"
              description="Keep exploring the feed to connect with more developers — new requests will show up here."
            />
          )}
          <div className="flex flex-col gap-3">
            {received.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ignored" className="mt-4">
          {ignoredStatus === "loading" && ignored.length === 0 && <ListSkeleton />}
          {ignoredStatus === "failed" && <p className="text-destructive text-sm">{ignoredError}</p>}
          {ignoredStatus === "succeeded" && ignored.length === 0 && (
            <EmptyState
              icon={UserX}
              title="No ignored developers"
              description="Anyone you've passed on from the feed will show up here in case you change your mind."
            />
          )}
          <div className="flex flex-col gap-3">
            {ignored.map((user) => (
              <IgnoredUserCard key={user._id} user={user} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
