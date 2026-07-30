export interface PremiumFeature {
  title: string;
  description: string;
  icon: string;
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    title: "Verified Blue Tick",
    description:
      "Get a blue tick on your profile to build trust and increase visibility.",
    icon: "🔵",
  },
  {
    title: "Chat Without Connection",
    description: "Start conversations even without being connected as friends.",
    icon: "💬",
  },
  {
    title: "Send Up to 500 Requests",
    description:
      "Expand your network faster with up to 500 connection requests per month.",
    icon: "🔁",
  },
  {
    title: "Advanced AI Features",
    description:
      "Unlock AI-powered profile optimization, smart matches, and message suggestions.",
    icon: "🤖",
  },
];
