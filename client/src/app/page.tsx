"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

export default function RootPage() {
  const router = useRouter();
  const { user, isBootstrapping } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (isBootstrapping) return;
    router.replace(user ? "/feed" : "/login");
  }, [isBootstrapping, user, router]);

  return null;
}
