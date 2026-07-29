"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

/** Small corner indicator for online/offline status, meant to overlay an Avatar. */
function AvatarStatus({ online = false }: { online?: boolean }) {
  return (
    <span
      className={cn(
        "border-background absolute right-0 bottom-0 size-2.5 rounded-full border-2",
        online ? "bg-online" : "bg-muted-foreground/50"
      )}
      aria-label={online ? "Online" : "Offline"}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarStatus };
