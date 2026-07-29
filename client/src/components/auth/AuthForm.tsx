"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, signupSchema } from "@/lib/validation/authSchemas";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, signup } from "@/store/slices/authSlice";

interface FormValues {
  firstName?: string;
  lastName?: string;
  emailId: string;
  password: string;
}

export function AuthForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector((state) => state.auth.status);
  const isSubmitting = status === "loading";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isLoginMode ? loginSchema : signupSchema),
  });

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    const action = isLoginMode
      ? login({ emailId: data.emailId, password: data.password })
      : signup({
          firstName: data.firstName ?? "",
          lastName: data.lastName,
          emailId: data.emailId,
          password: data.password,
        });

    const result = await dispatch(action);

    if (login.fulfilled.match(result) || signup.fulfilled.match(result)) {
      toast.success(isLoginMode ? "Welcome back!" : "Account created!");
      router.replace(isLoginMode ? "/feed" : "/profile");
    } else {
      toast.error((result.payload as string) ?? "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {!isLoginMode && (
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-destructive text-xs">{errors.firstName.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" autoComplete="family-name" {...register("lastName")} />
          </div>
        </div>
      )}

      <div className="grid gap-1.5">
        <Label htmlFor="emailId">Email</Label>
        <Input
          id="emailId"
          type="email"
          autoComplete="email"
          {...register("emailId")}
        />
        {errors.emailId && <p className="text-destructive text-xs">{errors.emailId.message}</p>}
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {isLoginMode && (
            <Link href="/forgot-password" className="text-primary text-xs hover:underline">
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isLoginMode ? "current-password" : "new-password"}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isLoginMode ? "Log in" : "Create account"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {isLoginMode ? "New to DevTinder?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={toggleMode}
          className="text-primary font-medium hover:underline"
        >
          {isLoginMode ? "Create an account" : "Log in"}
        </button>
      </p>
    </form>
  );
}
