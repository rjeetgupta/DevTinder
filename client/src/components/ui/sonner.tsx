"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * App-wide toast host. Mounted once in the root layout. Replaces
 * react-hot-toast from the old frontend — used for things like
 * "Request sent", "Profile updated", API error messages, etc.
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-left"
      toastOptions={{
        classNames: {
          toast:
            "glass group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/30 group-[.toaster]:text-foreground group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:brand-gradient group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
