"use client";

import { usePathname, useRouter } from "next/navigation";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/app-shell";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace("/login");
  };

  return (
    <AppShell
      activeHref={pathname}
      userName={user?.firstName}
      onLogout={handleLogout}
    >
      {children}
    </AppShell>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ProtectedShell>{children}</ProtectedShell>
    </AuthGuard>
  );
}
