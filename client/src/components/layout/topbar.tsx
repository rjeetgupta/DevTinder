"use client";

import Link from "next/link";
import { Bell, LogOut, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage, AvatarStatus } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({
  userName = "You",
  userPhoto,
  unreadCount = 0,
  onLogout,
}: {
  userName?: string;
  userPhoto?: string | null;
  unreadCount?: number;
  onLogout?: () => void;
}) {
  return (
    <header className="glass flex h-16 shrink-0 items-center justify-between gap-4 rounded-lg px-4">
      <span className="text-h3 hidden sm:block">DevTinder</span>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-full hover:bg-white/5"
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] justify-center rounded-full px-1 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Account menu"
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={userPhoto ?? undefined} alt={userName} />
                <AvatarFallback>{userName.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <AvatarStatus online />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onLogout}>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
