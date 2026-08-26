"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Users,
  MessageCircle,
  Sparkles,
  Radar,
  ShieldCheck,
  Menu,
  X,
  Check,
  RotateCcw,
  Crown,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NodeField, NodeMark } from "@/components/brand/node-mark";
import { PREMIUM_FEATURES } from "@/lib/constants/premium-features";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Premium", href: "#premium" },
];

const CORE_FEATURES = [
  {
    icon: Radar,
    title: "Curated discovery",
    desc: "A feed of developers ranked by real skill overlap, not vanity metrics — swipe past noise, not people.",
  },
  {
    icon: Users,
    title: "Skill-matched connections",
    desc: "See exactly which stacks and languages you share before you ever say hello. No cold, blind requests.",
  },
  {
    icon: MessageCircle,
    title: "Built-in chat",
    desc: "Move from match to conversation instantly, with real-time delivery, read receipts, and unread tracking.",
  },
  {
    icon: Sparkles,
    title: "AI career coach",
    desc: "Feed your skills in and get a personalized roadmap — must-have, recommended, and good-to-know topics.",
  },
];

const SILVER_PERKS = [
  { icon: Sparkles, text: "AI Career Coach", highlight: true },
  { icon: Check, text: "Verified badge on your profile" },
  { icon: RotateCcw, text: "View & restore ignored profiles" },
  { icon: Check, text: "100 connection requests per day" },
  { icon: MessageCircle, text: "Chat with anyone — no match needed" },
  { icon: Check, text: "Search for specific users & skills" },
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" aria-hidden />
      <div
        className="ambient-orb -top-32 left-1/2 h-100 w-100 -translate-x-1/2 md:h-150 md:w-150"
        aria-hidden
      />
      <div
        className="ambient-orb top-[60vh] -right-40 h-87.5 w-87.5 md:h-125 md:w-125"
        aria-hidden
      />

      {/* ---------------------------------------------------------------- */}
      {/* Navigation                                                       */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="glass mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-lg px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <NodeMark className="size-7" />
            <span className="font-display text-lg font-semibold tracking-tight">
              DevTinder
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground text-sm font-medium transition-colors hover:text-foreground focus-visible:text-primary outline-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">
                Get started <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-md text-foreground hover:bg-white/5 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="glass mx-auto mt-2 flex w-full max-w-6xl flex-col gap-1 rounded-lg p-3 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-muted-foreground rounded-md px-3 py-2 text-sm font-medium hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="outline" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Get started</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative px-4 pt-20 pb-24 md:pt-28 md:pb-32">
        <NodeField className="text-primary" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="glow-sm mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Now matching developers worldwide
          </div>

          <h1 className="text-h1 max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
            Find your next <span className="brand-gradient-text">collaborator</span>,
            not just a connection.
          </h1>

          <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            DevTinder matches you with developers who share your stack, your skill
            gaps, and your ambitions — then gets out of the way so you can build
            something together.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">
                Start matching <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#product">See how it works</a>
            </Button>
          </div>

          <div className="mt-14 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              { value: "10K+", label: "Developers" },
              { value: "40K+", label: "Connections made" },
              { value: "120+", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-semibold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1 text-xs font-mono-label uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* About / product section                                         */}
      {/* ---------------------------------------------------------------- */}
      <section id="product" className="relative px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono-label text-primary text-xs font-medium uppercase">
              What is DevTinder
            </p>
            <h2 className="text-h2 mt-3">Built for developers, not dating.</h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
              We took the parts of matching apps that actually work — a fast
              feed, clear signals, real-time chat — and pointed them at something
              more useful: finding people to build, ship, and learn with.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/15 hover:shadow-[0_10px_15px_rgba(0,0,0,0.3)]"
                >
                  <CardContent className="flex flex-col gap-3">
                    <div className="bg-primary/15 flex size-11 items-center justify-center rounded-lg">
                      <Icon className="text-primary size-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it works                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section id="how-it-works" className="relative px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono-label text-primary text-xs font-medium uppercase">
              How it works
            </p>
            <h2 className="text-h2 mt-3">Three steps to your next collaborator</h2>
          </div>

          <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Build your profile",
                desc: "Add your skills, experience level, and links — it powers every match you see.",
              },
              {
                step: "02",
                title: "Swipe the feed",
                desc: "Browse developers ranked by skill overlap. Connect, ignore, or dig into details.",
              },
              {
                step: "03",
                title: "Chat & build",
                desc: "Once you match, jump straight into real-time chat and take it from there.",
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-start gap-3">
                <span className="font-display text-3xl font-semibold text-primary/40">
                  {item.step}
                </span>
                <h3 className="font-display font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Premium                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="premium" className="relative px-4 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono-label text-primary text-xs font-medium uppercase">
              Premium
            </p>
            <h2 className="text-h2 mt-3">Unlock the full experience</h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
              Everything you need to network faster, stand out, and get an
              AI-built plan for closing your skill gaps.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <Card className="border-primary/20 glow-border lg:col-span-5">
              <CardContent className="flex h-full flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Crown className="text-primary size-5" />
                      <h3 className="font-display text-lg font-semibold">
                        Silver Membership
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Unlock AI & networking
                    </p>
                  </div>
                  <Badge>Best seller</Badge>
                </div>

                <div>
                  <span className="text-4xl font-extrabold">₹199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="flex flex-col gap-3">
                  {SILVER_PERKS.map(({ icon: Icon, text, highlight }) => (
                    <li
                      key={text}
                      className={cn(
                        "flex items-center gap-3 text-sm",
                        highlight && "bg-white/5 rounded-lg p-2 font-semibold"
                      )}
                    >
                      <Icon className="text-primary size-4 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="mt-auto" asChild>
                  <Link href="/login">
                    Get Silver Premium <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
              {PREMIUM_FEATURES.map((feature) => (
                <div key={feature.title} className="glass rounded-lg p-5">
                  <div className="mb-2 text-2xl">{feature.icon}</div>
                  <h4 className="font-display text-sm font-semibold">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative px-4 pb-24 md:pb-32">
        <div className="mx-auto max-w-4xl">
          <Card className="glow-border border-primary/20 overflow-hidden">
            <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
              <ShieldCheck className="text-primary size-8" strokeWidth={1.5} />
              <h2 className="text-h2 max-w-md">
                Your next collaborator is already on DevTinder.
              </h2>
              <p className="text-muted-foreground max-w-sm text-sm">
                Create a profile in under two minutes and start seeing matches
                today.
              </p>
              <Button size="lg" asChild>
                <Link href="/login">
                  Create your profile <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Footer                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="relative border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <NodeMark className="size-6" />
              <span className="font-display text-base font-semibold tracking-tight">
                DevTinder
              </span>
            </Link>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              The network built for developers to find collaborators, mentors,
              and teammates.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="font-mono-label text-muted-foreground text-xs uppercase">
                Product
              </h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                <li>
                  <a href="#product" className="text-muted-foreground hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#premium" className="text-muted-foreground hover:text-foreground">
                    Premium
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono-label text-muted-foreground text-xs uppercase">
                Account
              </h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forgot-password"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Reset password
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono-label text-muted-foreground text-xs uppercase">
                Company
              </h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                <li>
                  <span className="text-muted-foreground/70">About</span>
                </li>
                <li>
                  <span className="text-muted-foreground/70">Privacy</span>
                </li>
                <li>
                  <span className="text-muted-foreground/70">Terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} DevTinder. All rights reserved.</p>
          <p className="font-mono-label">Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}
