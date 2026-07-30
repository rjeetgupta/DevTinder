"use client";

import { ProfileForm } from "@/components/profile/profile-form";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function ProfilePage() {
  useDocumentTitle("Profile");
  return (
    <div className="mx-auto w-full max-w-5xl p-4 pb-10 sm:p-6">
      <ProfileForm />
    </div>
  );
}