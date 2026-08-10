"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Braces, MapPin, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserDetailDialog } from "@/components/shared/user-detail-dialog";
import { optionLabel, skillIdsToNames, STATE_OPTIONS } from "@/lib/constants/profile-options";
import type { User } from "@/types";

export function ConnectionCard({ connection }: { connection: User }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const initials =
    `${connection.firstName?.[0] ?? ""}${connection.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const stateName = optionLabel(STATE_OPTIONS, connection.location?.state);
  const skillNames = skillIdsToNames(connection.skills ?? []);

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
          className={`size-16 shrink-0 ring-2 ring-offset-2 ring-offset-transparent ${
            connection.isPremium ? "ring-primary ring-offset-background shadow-[0_0_16px_rgba(245,158,11,0.35)]" : "ring-primary/50"
          }`}
        >
          <AvatarImage src={connection.photo ?? undefined} alt={connection.firstName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="flex flex-wrap items-center gap-1.5 font-semibold">
            {connection.firstName} {connection.lastName}
            {connection.isPremium && <BadgeCheck className="text-primary size-4 shrink-0" />}
            {connection.age ? (
              <span className="text-muted-foreground text-sm font-normal">
                ({connection.age})
              </span>
            ) : null}
          </h3>
          <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-3 text-xs">
            {connection.experienceLevel && (
              <span className="flex items-center gap-1 capitalize">
                <Braces className="size-3" /> {connection.experienceLevel}
              </span>
            )}
            {stateName && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" /> {stateName}
              </span>
            )}
          </div>
          {skillNames.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {skillNames.slice(0, 5).map((name) => (
                <Badge key={name} variant="glass" className="text-[11px]">
                  {name}
                </Badge>
              ))}
              {skillNames.length > 5 && (
                <span className="text-muted-foreground text-xs">
                  +{skillNames.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        <Button asChild size="sm" className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <Link href={`/chat/${connection._id}`}>
            <MessageCircle className="size-4" />
            Message
          </Link>
        </Button>
      </Card>

      <UserDetailDialog user={connection} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </>
  );
}
