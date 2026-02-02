'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Code2, Users, Zap, MessageSquare, Crown, Shield } from 'lucide-react';
import Link from 'next/link';
import { features, pricingPlans } from '@/lib/constant';

export default function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <motion.div 
            style={{ opacity }}
            className="absolute inset-0 bg-linear-to-br from-violet-50 via-transparent to-pink-50 dark:from-violet-950/20 dark:via-transparent dark:to-pink-950/20"
          />
          
          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-6 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full"
              >
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Connect. Code. Collaborate.
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block mt-2 bg-linear-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  Dev Match
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                DevTinder connects developers based on skills, interests, and tech stack. 
                Swipe right on your next coding partner, mentor, or collaborator.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-violet-600 text-white rounded-xl text-lg font-semibold hover:bg-violet-700 transition-all hover:scale-105 shadow-lg hover:shadow-violet-500/50"
                >
                  Start Matching
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-xl text-lg font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Built for Developers
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Everything you need to find and connect with developers who share your passion
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features?.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all hover:shadow-lg group"
                >
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing/Premium Section */}
        <section id="pricing" className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Start free, upgrade when you're ready
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans?.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-8 rounded-2xl border-2 ${
                    plan.featured
                      ? 'border-violet-500 bg-linear-to-br from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
                  }`}
                >
                  {plan.featured && (
                    <div className="inline-block px-3 py-1 bg-violet-600 text-white text-sm font-semibold rounded-full mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-zinc-600 dark:text-zinc-400">/{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-violet-600 dark:text-violet-400 mt-1">✓</span>
                        <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.featured
                      ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg hover:shadow-violet-500/50'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}>
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-linear-to-br from-violet-600 to-pink-600 text-white">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Find Your Dev Match?
              </h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                Join thousands of developers already connecting, collaborating, and building together
              </p>
              <Link
                href="/signup"
                className="inline-block px-8 py-4 bg-white text-violet-600 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all hover:scale-105"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
