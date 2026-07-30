"use client";

import Link from "next/link";

import { isNavItemActive, NAV_ITEMS } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export function MobileNav({ activeHref }: { activeHref?: string }) {
  return (
    <nav
      className="glass fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-xl px-1 py-2 md:hidden"
      aria-label="Primary"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(item.href, activeHref);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
