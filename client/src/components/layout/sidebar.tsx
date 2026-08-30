import Link from "next/link";
import {
  Crown,
  Heart,
  MessageCircle,
  Radar,
  Sparkles,
  Users,
  UserRound,
} from "lucide-react";

import { NodeMark } from "@/components/brand/node-mark";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { label: "Feed", icon: Radar, href: "/feed" },
  { label: "Requests", icon: Heart, href: "/requests" },
  { label: "Connections", icon: Users, href: "/connections" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  // { label: "AI Coach", icon: Sparkles, href: "/ai-coach" },
  { label: "Premium", icon: Crown, href: "/premium" },
  { label: "Profile", icon: UserRound, href: "/profile" },
] as const;

/** Matches nested routes too (e.g. `/chat/abc123` still highlights "Chat"). */
export function isNavItemActive(href: string, activeHref?: string) {
  if (!activeHref) return false;
  return activeHref === href || activeHref.startsWith(`${href}/`);
}

/**
 * Presentational sidebar shell. Takes `activeHref` as a prop rather than
 * reading the router itself, so it can be dropped into the design-system
 * playground and exercised without a real router/auth context.
 */
export function Sidebar({
  activeHref,
  className,
}: {
  activeHref?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "glass hidden h-full w-60 shrink-0 flex-col gap-6 rounded-lg p-4 md:flex",
        className
      )}
    >
      <div className="flex items-center gap-2 px-2 pt-1">
        <NodeMark />
        <span className="font-display text-lg font-semibold tracking-tight">DevTinder</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(item.href, activeHref);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary shadow-[0_0_0_1px_rgba(245,158,11,0.2),0_0_20px_rgba(245,158,11,0.1)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon
                className="size-4.5"
                strokeWidth={1.5}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
