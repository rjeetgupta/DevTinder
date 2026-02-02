import { Code2, Crown, MessageSquare, Shield, Users, Zap } from "lucide-react";

export const features = [
  {
    icon: Users,
    title: 'Smart Matching',
    description: 'Algorithm-based matching based on tech stack, experience level, and interests. Find developers who complement your skills.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Instant messaging with code snippet support. Discuss ideas, share knowledge, and plan collaborations in real-time.',
  },
  {
    icon: Zap,
    title: 'Quick Connections',
    description: 'Swipe right to send interest, accept or reject requests. Build your developer network effortlessly.',
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'Connect with confidence. All profiles are verified and showcase real skills, projects, and experience.',
  },
  {
    icon: Crown,
    title: 'Premium Features',
    description: 'Unlock advanced filters, unlimited swipes, see who liked you, and priority matching with premium membership.',
  },
  {
    icon: Code2,
    title: 'Skill Showcase',
    description: 'Display your tech stack, projects, and achievements. Let your code speak for itself.',
  },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: null,
    cta: 'Get Started',
    featured: false,
    features: [
      '10 swipes per day',
      'Basic profile customization',
      'Standard matching algorithm',
      'Message accepted connections',
      'View your matches',
    ],
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    cta: 'Go Premium',
    featured: true,
    features: [
      'Unlimited swipes',
      'Advanced profile customization',
      'Priority matching algorithm',
      'See who liked your profile',
      'Advanced filters by tech stack',
      'Unlimited messaging',
      'Profile boost feature',
      'Ad-free experience',
    ],
  },
];