"use client";

import { useState } from "react";
import { BadgeCheck, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserDetailDialog } from "@/components/shared/user-detail-dialog";
import { skillIdsToNames } from "@/lib/constants/profile-options";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { reviewRequest } from "@/store/slices/requestSlice";
import type { ConnectionRequest } from "@/types";

export function RequestCard({ request }: { request: ConnectionRequest }) {
  const dispatch = useAppDispatch();
  const pendingId = useAppSelector((state) => state.requests.pendingId);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fromUser = request.fromUserId;
  if (!fromUser) return null;

  const isPending = pendingId === request._id;
  const initials = `${fromUser.firstName?.[0] ?? ""}${fromUser.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const skillNames = skillIdsToNames(fromUser.skills ?? []);

  const handleReview = async (status: "accepted" | "rejected") => {
    const result = await dispatch(reviewRequest({ requestId: request._id, status }));
    if (reviewRequest.fulfilled.match(result)) {
      setDetailsOpen(false);
      toast.success(status === "accepted" ? "Connection accepted!" : "Request rejected");
    } else {
      toast.error((result.payload as string) ?? "Could not review this request.");
    }
  };

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setDetailsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDetailsOpen(true);
          }
        }}
        className="cursor-pointer flex-row items-center gap-4 p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Avatar
          className={`size-14 shrink-0 ring-2 ring-offset-2 ring-offset-transparent ${
            fromUser.isPremium ? "ring-primary ring-offset-background shadow-[0_0_16px_rgba(245,158,11,0.35)]" : "ring-primary/50"
          }`}
        >
          <AvatarImage src={fromUser.photo ?? undefined} alt={fromUser.firstName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 font-semibold">
            {fromUser.firstName} {fromUser.lastName}
            {fromUser.isPremium && <BadgeCheck className="text-primary size-4 shrink-0" />}
            {fromUser.age ? (
              <span className="text-muted-foreground text-sm font-normal">({fromUser.age})</span>
            ) : null}
          </h3>
          <p className="text-muted-foreground text-sm capitalize">
            {fromUser.gender ?? "Developer"}
          </p>
          {skillNames.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {skillNames.slice(0, 4).map((name) => (
                <Badge key={name} variant="glass" className="text-[11px]">
                  {name}
                </Badge>
              ))}
              {skillNames.length > 4 && (
                <span className="text-muted-foreground text-xs">
                  +{skillNames.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        <div
          className="flex shrink-0 flex-col gap-2 sm:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <Button size="sm" disabled={isPending} onClick={() => handleReview("accepted")}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => handleReview("rejected")}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Reject
          </Button>
        </div>
      </Card>

      <UserDetailDialog
        user={fromUser}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        footer={
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => handleReview("rejected")}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
              Reject
            </Button>
            <Button disabled={isPending} onClick={() => handleReview("accepted")}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Accept
            </Button>
          </div>
        }
      />
    </>
  );
}
