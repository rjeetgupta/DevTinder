'use client';

import Link from 'next/link';
import { Code2, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Code2 className="w-7 h-7 text-violet-600 dark:text-violet-400" />
              <span className="text-xl font-bold">DevTinder</span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Connecting developers worldwide. Find your perfect coding partner, mentor, or collaborator.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/features" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/premium" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Premium
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/blog" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-8 p-6 bg-linear-to-br from-violet-50 to-pink-50 dark:from-violet-950/20 dark:to-pink-950/20 rounded-2xl border border-violet-100 dark:border-violet-900/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Stay Updated</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Get the latest updates, tips, and exclusive offers delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center md:text-left">
              &copy; {currentYear} DevTinder. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by developers, for developers</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}