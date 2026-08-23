"use client";

import Link from "next/link";
import { AyoAIIcon } from "@/components/brand/logo";
import { Globe, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/50 text-foreground pt-16 pb-12 px-6 sm:px-8 select-none">
      <div className="max-w-[1400px] mx-auto">
        {/* Multi-Column Links Grid matching OpenAI Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 pb-16 border-b border-border/40">
          {/* Research */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Research
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/research/overview" className="text-muted-foreground hover:text-foreground transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/research/overview" className="text-muted-foreground hover:text-foreground transition-colors">
                  Research Index
                </Link>
              </li>
              <li>
                <Link href="/research/safety" className="text-muted-foreground hover:text-foreground transition-colors">
                  Safety & Alignment
                </Link>
              </li>
              <li>
                <Link href="/research/overview" className="text-muted-foreground hover:text-foreground transition-colors">
                  Research Residency
                </Link>
              </li>
              <li>
                <Link href="/research/overview" className="text-muted-foreground hover:text-foreground transition-colors">
                  Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Products
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/c" className="text-muted-foreground hover:text-foreground transition-colors">
                  ayoAI Chat
                </Link>
              </li>
              <li>
                <Link href="/product/features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Canvas & Codex
                </Link>
              </li>
              <li>
                <Link href="/product/features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Voice Intelligence
                </Link>
              </li>
              <li>
                <Link href="/product/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/c" className="text-muted-foreground hover:text-foreground transition-colors">
                  Desktop & Mobile Apps
                </Link>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Business
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/business/enterprise" className="text-muted-foreground hover:text-foreground transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/business/enterprise" className="text-muted-foreground hover:text-foreground transition-colors">
                  ayoAI Enterprise
                </Link>
              </li>
              <li>
                <Link href="/business/enterprise" className="text-muted-foreground hover:text-foreground transition-colors">
                  Teams & Workspaces
                </Link>
              </li>
              <li>
                <Link href="/business/enterprise" className="text-muted-foreground hover:text-foreground transition-colors">
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link href="/company/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Developers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/product/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Platform
                </Link>
              </li>
              <li>
                <Link href="/product/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/product/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/product/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookbook
                </Link>
              </li>
              <li>
                <Link href="/support/status" className="text-muted-foreground hover:text-foreground transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/company/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/company/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/company/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  News & Blog
                </Link>
              </li>
              <li>
                <Link href="/company/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Security & Trust
                </Link>
              </li>
              <li>
                <Link href="/foundation" className="text-muted-foreground hover:text-foreground transition-colors">
                  ayoAI Foundation
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Policies
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/support/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link href="/research/safety" className="text-muted-foreground hover:text-foreground transition-colors">
                  Usage Policies
                </Link>
              </li>
              <li>
                <Link href="/support/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Region Switcher */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <AyoAIIcon size={18} />
              <span className="font-semibold text-sm text-foreground">ayoAI</span>
            </Link>
            <span>© 2026 ayoAI Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
              <Globe className="w-3.5 h-3.5" />
              <span>English (United States)</span>
            </button>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Twitter / X
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
