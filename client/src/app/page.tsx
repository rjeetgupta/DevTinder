"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LandingPage } from "@/components/landing/landing-page";
import { useAppSelector } from "@/store/hooks";

export default function RootPage() {
  const router = useRouter();
  const { user, isBootstrapping } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isBootstrapping) return;
    if (user) router.replace("/feed");
  }, [isBootstrapping, user, router]);

  if (isBootstrapping || user) return null;

  return <LandingPage />;
}
