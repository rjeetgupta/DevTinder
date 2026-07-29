import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password — DevTinder",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-h2 mb-2 text-center">Reset your password</h1>
      <p className="text-muted-foreground mb-6 text-center text-sm">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
    </>
  );
}
