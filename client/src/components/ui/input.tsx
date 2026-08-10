import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input flex h-11 w-full min-w-0 rounded-lg border bg-[rgba(26,26,36,0.6)] px-3.5 py-2 text-sm shadow-xs backdrop-blur-sm transition-all duration-200 outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };
