"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PlanCards } from "@/components/premium/plan-cards";
import { PremiumStatusCard } from "@/components/premium/premium-status-card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshCurrentUser } from "@/store/slices/authSlice";
import {
  createPremiumOrder,
  markPremiumActive,
  verifyPremiumStatus,
} from "@/store/slices/premiumSlice";
import type { MembershipType } from "@/types";

export default function PremiumPage() {
  useDocumentTitle("Premium");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isPremium, verifyStatus, orderStatus } = useAppSelector((state) => state.premium);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    dispatch(verifyPremiumStatus());
  }, [dispatch]);

  const handleSelectPlan = async (plan: MembershipType) => {
    if (!razorpayReady) {
      toast.error("Payment SDK is still loading — try again in a moment.");
      return;
    }

    const result = await dispatch(createPremiumOrder(plan));
    if (!createPremiumOrder.fulfilled.match(result)) {
      toast.error((result.payload as string) ?? "Unable to initiate payment.");
      return;
    }

    const { keyId, amount, currency, orderId, notes } = result.payload;

    const razorpay = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name: "DevTinder",
      description: `Upgrade to ${plan} plan`,
      order_id: orderId,
      prefill: {
        name: `${notes.firstName} ${notes.lastName ?? ""}`.trim(),
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: { color: plan === "gold" ? "#F59E0B" : "#7C5CFF" },
      handler: async () => {
        const verified = await dispatch(verifyPremiumStatus()).unwrap();
        if (verified) {
          dispatch(markPremiumActive());
          dispatch(refreshCurrentUser());
          toast.success("Welcome to Premium!");
        }
      },
    });

    razorpay.open();
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />
      <div className="mx-auto w-full max-w-4xl p-4 pb-10 sm:p-6">
        {verifyStatus === "loading" ? (
          <div className="flex justify-center py-24">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : isPremium ? (
          <PremiumStatusCard membershipType={user?.memberShipType} />
        ) : (
          <PlanCards onSelectPlan={handleSelectPlan} isSubmitting={orderStatus === "loading"} />
        )}
      </div>
    </>
  );
}
