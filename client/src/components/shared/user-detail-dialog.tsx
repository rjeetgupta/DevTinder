"use client";

import { BadgeCheck, Braces, Globe, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { optionLabel, skillIdsToNames, STATE_OPTIONS } from "@/lib/constants/profile-options";
import type { User } from "@/types";

const SOCIAL_LINKS: Array<{
  key: keyof User;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = [
  { key: "githubUrl", icon: FaGithub, label: "GitHub" },
  { key: "linkedinUrl", icon: FaLinkedin, label: "LinkedIn" },
  { key: "twitterUrl", icon: FaXTwitter, label: "Twitter" },
  { key: "portfolioUrl", icon: Globe, label: "Portfolio" },
];

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
  footer,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: React.ReactNode;
}) {
  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const stateName = optionLabel(STATE_OPTIONS, user.location?.state);
  const skillNames = skillIdsToNames(user.skills ?? []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <Avatar
              className={`size-24 ring-2 ring-offset-2 ring-offset-transparent ${
                user.isPremium ? "ring-primary ring-offset-background shadow-[0_0_16px_rgba(245,158,11,0.35)]" : "ring-primary/50"
              }`}
            >
              <AvatarImage src={user.photo ?? undefined} alt={user.firstName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <DialogTitle className="flex items-center gap-1.5">
              {user.firstName} {user.lastName}
              {user.age ? `, ${user.age}` : ""}
              {user.isPremium && <BadgeCheck className="text-primary size-4" />}
            </DialogTitle>
            {(stateName || user.experienceLevel) && (
              <DialogDescription className="flex items-center gap-3">
                {stateName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {stateName}, India
                  </span>
                )}
                {user.experienceLevel && (
                  <span className="flex items-center gap-1">
                    <Braces className="size-3" /> {user.experienceLevel}
                  </span>
                )}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        {user.bio && <p className="text-muted-foreground text-sm">{user.bio}</p>}

        {skillNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skillNames.map((name) => (
              <Badge key={name} variant="glass">
                {name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          {SOCIAL_LINKS.map(({ key, icon: Icon, label }) => {
            const url = user[key] as string | undefined;
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            );
          })}
        </div>

        {footer}
      </DialogContent>
    </Dialog>
  );
}
