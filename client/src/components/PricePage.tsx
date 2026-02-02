'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Zap, X, Star, Users, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  popular?: boolean;
  features: string[];
  limits: {
    swipes: string;
    messages: string;
    filters: string;
  };
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic profile customization',
      '10 swipes per day',
      'Match with developers',
      'Message your matches',
      'Basic search filters',
    ],
    limits: {
      swipes: '10/day',
      messages: 'Unlimited',
      filters: 'Basic',
    },
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited swipes',
      'See who liked your profile',
      'Advanced search filters',
      'Priority in matching queue',
      'Rewind last swipe',
      '5 Super Likes per week',
      'Read receipts',
      'Ad-free experience',
    ],
    limits: {
      swipes: 'Unlimited',
      messages: 'Unlimited',
      filters: 'Advanced',
    },
  },
  {
    id: 'premium_yearly',
    name: 'Premium Annual',
    price: 99.99,
    interval: 'year',
    features: [
      'Everything in Premium Monthly',
      'Save 17% with annual billing',
      'Priority customer support',
      'Early access to new features',
      'Profile analytics dashboard',
      'Custom profile badge',
    ],
    limits: {
      swipes: 'Unlimited',
      messages: 'Unlimited',
      filters: 'Advanced + Custom',
    },
  },
];

export default function PricingPage() {
  const { currentUser, verifyPayment } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // const handleUpgrade = async (planId: string) => {
  //   if (planId === 'free' || currentUser?.isPremium) return;

  //   setSelectedPlan(planId);
  //   setIsProcessing(true);

  //   try {
  //     // Create Razorpay order
  //     const orderData = await upgradeToPremium(planId);

  //     // Load Razorpay script
  //     const script = document.createElement('script');
  //     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //     script.async = true;
  //     document.body.appendChild(script);

  //     script.onload = () => {
  //       const plan = plans.find(p => p.id === planId);
        
  //       const options = {
  //         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //         amount: orderData?.amount,
  //         currency: orderData?.currency,
  //         name: 'DevTinder',
  //         description: `${plan?.name} Subscription`,
  //         order_id: orderData?.orderId,
  //         handler: async (response: any) => {
  //           try {
  //             // Verify payment on backend
  //             await verifyPayment({
  //               razorpay_order_id: response.razorpay_order_id,
  //               razorpay_payment_id: response.razorpay_payment_id,
  //               razorpay_signature: response.razorpay_signature,
  //             });

  //             // Show success message
  //             alert('Payment successful! Welcome to Premium 🎉');
  //           } catch (error) {
  //             console.error('Payment verification failed:', error);
  //             alert('Payment verification failed. Please contact support.');
  //           }
  //         },
  //         prefill: {
  //           name: `${currentUser?.firstName} ${currentUser?.lastName || ''}`,
  //           email: currentUser?.email,
  //         },
  //         theme: {
  //           color: '#8b5cf6',
  //         },
  //         modal: {
  //           ondismiss: () => {
  //             setIsProcessing(false);
  //             setSelectedPlan(null);
  //           },
  //         },
  //       };

  //       const razorpay = new window.Razorpay(options);
  //       razorpay.open();
  //     };

  //     script.onerror = () => {
  //       alert('Failed to load payment gateway. Please try again.');
  //       setIsProcessing(false);
  //       setSelectedPlan(null);
  //     };
  //   } catch (error) {
  //     console.error('Upgrade error:', error);
  //     alert('Failed to initiate payment. Please try again.');
  //     setIsProcessing(false);
  //     setSelectedPlan(null);
  //   }
  // };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-6">
            <Crown className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              Upgrade Your Experience
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your Plan
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Start free and upgrade anytime to unlock premium features and supercharge your networking
          </p>
        </motion.div>

        {/* Current Plan Badge */}
        {currentUser?.isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-8 p-6 bg-linear-to-r from-violet-500 to-pink-500 rounded-2xl text-white text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 fill-current" />
              <h3 className="text-2xl font-bold">You're a Premium Member!</h3>
            </div>
            <p className="opacity-90">
              Enjoying unlimited swipes and exclusive features
            </p>
            {currentUser.membershipValidity && (
              <p className="text-sm mt-2 opacity-75">
                Valid until {new Date(currentUser.membershipValidity).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border-2 transition-all ${
                plan.popular
                  ? 'border-violet-500 bg-linear-to-br from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30 scale-105 shadow-xl'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-500'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-violet-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">₹{plan.price}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    /{plan.interval}
                  </span>
                </div>
                
                {plan.interval === 'year' && (
                  <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full">
                    Save 17%
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Limits */}
              <div className="mb-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Swipes</div>
                    <div className="font-bold text-sm">{plan.limits.swipes}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Messages</div>
                    <div className="font-bold text-sm">{plan.limits.messages}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Filters</div>
                    <div className="font-bold text-sm">{plan.limits.filters}</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                // onClick={() => handleUpgrade(plan.id)}
                disabled={
                  isProcessing ||
                  plan.id === 'free' ||
                  (currentUser?.isPremium && plan.id !== 'free')
                }
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
                    : plan.id === 'free'
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-default'
                    : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : plan.id === 'free' ? (
                  'Current Plan'
                ) : currentUser?.isPremium ? (
                  'Already Premium'
                ) : (
                  'Upgrade Now'
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                  >
                    <td className="py-4 px-4 text-zinc-700 dark:text-zinc-300">
                      {feature.name}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.free === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : feature.free === false ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-sm text-zinc-500">{feature.free}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature.premium === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                          {feature.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Have questions? Check our{' '}
            <a href="/faq" className="text-violet-600 dark:text-violet-400 hover:underline">
              FAQ page
            </a>{' '}
            or{' '}
            <a href="/contact" className="text-violet-600 dark:text-violet-400 hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const comparisonFeatures = [
  { name: 'Daily Swipes', free: '10', premium: 'Unlimited' },
  { name: 'Message Matches', free: true, premium: true },
  { name: 'See Who Liked You', free: false, premium: true },
  { name: 'Rewind Feature', free: false, premium: true },
  { name: 'Super Likes', free: '1/week', premium: '5/week' },
  { name: 'Advanced Filters', free: false, premium: true },
  { name: 'Priority Matching', free: false, premium: true },
  { name: 'Read Receipts', free: false, premium: true },
  { name: 'Profile Boost', free: false, premium: true },
  { name: 'Ad-Free', free: false, premium: true },
];