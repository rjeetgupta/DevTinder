"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

/**
 * Wraps the protected route group. `middleware.ts` already blocks
 * requests with no auth cookie at all, but only this guard can react
 * to a session that turns out to be invalid/expired (a 401 from any
 * API call flips `auth.user` to null via `sessionExpired`).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isBootstrapping } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isBootstrapping && !user) {
      router.replace("/login");
    }
  }, [isBootstrapping, user, router]);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading your session…</div>
      </div>
    );
  }

  if (!user) {
    // Redirect above is already in flight; render nothing meanwhile.
    return null;
  }

  return <>{children}</>;
}
