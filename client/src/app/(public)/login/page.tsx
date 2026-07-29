import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Log in — DevTinder",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-h2 mb-6 text-center">Welcome back</h1>
      <AuthForm />
    </>
  );
}
