"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resendRequest } from "@/store/slices/requestSlice";
import type { User } from "@/types";

export function IgnoredUserCard({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const pendingId = useAppSelector((state) => state.requests.pendingId);
  const isPending = pendingId === user._id;
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const handleResend = async () => {
    const result = await dispatch(resendRequest({ userId: user._id, status: "intrested" }));
    if (resendRequest.fulfilled.match(result)) {
      toast.success("Connection request sent!");
    } else {
      toast.error((result.payload as string) ?? "Action failed.");
    }
  };

  return (
    <Card className="flex-row items-center gap-4 p-4">
      <Avatar className="size-12 shrink-0">
        <AvatarImage src={user.photo ?? undefined} alt={user.firstName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-muted-foreground text-xs">You previously ignored this developer</p>
      </div>
      <Button variant="glass" size="sm" disabled={isPending} onClick={handleResend}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
        Reconsider
      </Button>
    </Card>
  );
}
