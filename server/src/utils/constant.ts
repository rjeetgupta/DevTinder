export enum SubscriptionTier {
    FREE = "FREE",
    SILVER = "SILVER",
    GOLD = "GOLD",
}

export interface SubscriptionPlan {
    tier: SubscriptionTier;
    displayName: string;
    price: number; // INR
    validityDays: number; // days
    features: string[];
    isPopular?: boolean;
}

export const SubscriptionPlans: Record<SubscriptionTier, SubscriptionPlan> = {
    [SubscriptionTier.FREE]: {
        tier: SubscriptionTier.FREE,
        displayName: "Free",
        price: 0,
        validityDays: 0,
        features: ["Limited daily likes", "Swipe & match"],
    },

    [SubscriptionTier.SILVER]: {
        tier: SubscriptionTier.SILVER,
        displayName: "Silver",
        price: 999,
        validityDays: 30,
        features: ["Unlimited likes", "Ad-free experience"],
    },

    [SubscriptionTier.GOLD]: {
        tier: SubscriptionTier.GOLD,
        displayName: "Gold",
        price: 1999,
        validityDays: 30,
        isPopular: true,
        features: [
            "See who liked you",
            "Priority visibility",
            "Profile verified badge",
        ],
    },
};
