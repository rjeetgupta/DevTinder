import {
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
    { label: "AI Coach", icon: Sparkles, href: "/ai-coach" },
    { label: "Profile", icon: UserRound, href: "/profile" },
  ] as const;
  
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
          "glass hidden h-full w-60 shrink-0 flex-col gap-6 rounded-xl p-4 md:flex",
          className
        )}
      >
        <div className="flex items-center gap-2 px-2 pt-1">
          <NodeMark />
          <span className="text-h3 tracking-tight">DevTinder</span>
        </div>
  
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === activeHref;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>
    );
}
  