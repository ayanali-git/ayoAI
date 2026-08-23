"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ChevronDown, ArrowUpRight, ArrowUp, Menu } from "lucide-react";
import { AyoAIIcon } from "@/components/brand/logo";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MegaMenuCategory = "research" | "products" | "business" | "developers" | "company" | null;

export function MarketingHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MegaMenuCategory>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle escape key to close menu/search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnter = (category: MegaMenuCategory) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!isSearchOpen) {
      setActiveMenu(category);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/c?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Backdrop blur overlay when mega menu is active */}
      <div
        className={cn(
          "fixed inset-0 top-14 z-40 bg-black/70 backdrop-blur-md transition-opacity duration-200 pointer-events-none",
          activeMenu ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
        onClick={() => setActiveMenu(null)}
      />

      {/* FULLSCREEN SEARCH OVERLAY (OpenAI Style centered input below fixed header) */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center pt-24 px-6 animate-in fade-in-0 duration-150 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchOpen(false);
            }
          }}
        >
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto">
            <div className="w-full flex items-center justify-between border-b border-white/20 pb-3">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about research, models, pricing..."
                className="w-full bg-transparent text-2xl sm:text-3xl text-white font-normal placeholder:text-neutral-500 outline-none border-none ring-0"
              />
              <div className="flex items-center gap-2 shrink-0 pl-4">
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                  aria-label="Submit search"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <header
        className="sticky top-0 z-50 w-full bg-background border-b border-border/40 select-none transition-colors duration-200"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 h-14 flex items-center justify-between relative">
          {/* Left Brand Logo & Main Nav Items */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              onClick={() => {
                setActiveMenu(null);
                setIsSearchOpen(false);
              }}
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <AyoAIIcon size={20} />
              <span className="font-bold text-[17px] tracking-tight text-foreground">
                ayoAI
              </span>
            </Link>

            {/* OpenAI-Style Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Research */}
              <button
                onMouseEnter={() => handleMouseEnter("research")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "research" ? null : "research");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer",
                  activeMenu === "research" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Research
              </button>

              {/* Products */}
              <button
                onMouseEnter={() => handleMouseEnter("products")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "products" ? null : "products");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer",
                  activeMenu === "products" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Products
              </button>

              {/* Business */}
              <button
                onMouseEnter={() => handleMouseEnter("business")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "business" ? null : "business");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer",
                  activeMenu === "business" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Business
              </button>

              {/* Developers */}
              <button
                onMouseEnter={() => handleMouseEnter("developers")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "developers" ? null : "developers");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer",
                  activeMenu === "developers" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Developers
              </button>

              {/* Company */}
              <button
                onMouseEnter={() => handleMouseEnter("company")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "company" ? null : "company");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer",
                  activeMenu === "company" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Company
              </button>

              {/* Foundation */}
              <Link
                href="/foundation"
                onClick={() => {
                  setActiveMenu(null);
                  setIsSearchOpen(false);
                }}
                className="text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Foundation
              </Link>

              {/* Search / Close Toggle in Navigation */}
              {isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-foreground hover:opacity-80 p-1 transition-opacity cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveMenu(null);
                    setIsSearchOpen(true);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              )}
            </nav>
          </div>

          {/* Right CTA Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 cursor-pointer">
                      <span>Account</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl">
                    <DropdownMenuItem asChild>
                      <Link href="/c" className="cursor-pointer text-sm">
                        Open Chat
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer text-sm">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-500 hover:text-red-500 focus:text-red-500 cursor-pointer text-sm">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  asChild
                  className="group rounded-full px-4 h-8 text-[13px] font-medium bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Link href="/c" className="flex items-center">
                    <span>Go to Chat</span>
                    <AnimatedArrow size={13} />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-[13.5px] font-medium text-foreground hover:opacity-80 transition-opacity px-2.5 py-1 rounded-full border border-border/80 cursor-pointer">
                      <span>Log in</span>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-xl">
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="cursor-pointer text-sm">
                        Log in to ayoAI
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login?type=enterprise" className="cursor-pointer text-sm">
                        Log in to Enterprise
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  asChild
                  className="group rounded-full px-4 h-8 text-[13px] font-medium bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Link href="/c" className="flex items-center">
                    <span>Try ayoAI</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* OPENAI MEGA MENU DROPDOWNS (Desktop Floating Overlay)            */}
        {/* ---------------------------------------------------------------- */}
        {activeMenu && (
          <div
            className="hidden lg:block absolute top-14 left-0 w-full border-b border-border/40 bg-background/98 backdrop-blur-2xl shadow-2xl transition-all duration-150 animate-in fade-in-0 slide-in-from-top-1 z-50"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1400px] mx-auto px-12 py-10">
              {/* RESEARCH MEGA MENU */}
              {activeMenu === "research" && (
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Explore Research
                    </p>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Research Index
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Research Overview
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Research Residency
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/safety"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Safety
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Latest Advancements
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI-5.6
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI-5.5
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI-5.4
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI-5.3 Instant
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI-5.3-Codex
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* PRODUCTS MEGA MENU (Matching Screenshot 1) */}
              {activeMenu === "products" && (
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Explore Products
                    </p>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/c"
                          onClick={() => setActiveMenu(null)}
                          className="group inline-flex items-center text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          <span>ayoAI Chat</span>
                          <ArrowUpRight className="w-5 h-5 ml-1.5 text-muted-foreground group-hover:text-foreground" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/features"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Codex & Canvas
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Resources
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>
                        <Link
                          href="/company/blog"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Release Notes
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          API Platform
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/pricing"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI Academy & Guides
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* BUSINESS MEGA MENU (Matching Screenshot 2) */}
              {activeMenu === "business" && (
                <div className="grid grid-cols-3 gap-12">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Explore Business
                    </p>
                    <ul className="space-y-3.5">
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="text-xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Overview
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="text-xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Solutions
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="text-xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Resources
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="text-xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Customer Stories
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/pricing"
                          onClick={() => setActiveMenu(null)}
                          className="text-xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Pricing
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/contact"
                          onClick={() => setActiveMenu(null)}
                          className="text-xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Contact Sales
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Products
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          ayoAI Work & Teams
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Codex Enterprise
                        </Link>
                      </li>
                      <li>
                        <Link href="/product/api-docs" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          API Platform
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          ayoAI Frontier
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          ayoAI Presence
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Daybreak
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Solutions
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Finance & Banking
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Data Analytics
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Design & Creative
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Life Sciences & Biotech
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Cybersecurity
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/enterprise" onClick={() => setActiveMenu(null)} className="hover:text-foreground transition-colors">
                          Education & Higher Ed
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* DEVELOPERS MEGA MENU (Matching Screenshot 3) */}
              {activeMenu === "developers" && (
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Explore Developers
                    </p>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/product/features"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Codex
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          API Platform
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="group inline-flex items-center text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          <span>Autonomous Agents</span>
                          <ArrowUpRight className="w-5 h-5 ml-1.5 text-muted-foreground group-hover:text-foreground" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/research/overview"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Open Models
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="group inline-flex items-center text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          <span>Apps SDK</span>
                          <ArrowUpRight className="w-5 h-5 ml-1.5 text-muted-foreground group-hover:text-foreground" />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Resources
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Docs</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Codex Use Cases</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Cookbook & Recipes</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/blog"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Developer Showcase</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/blog"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Developer Blog</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/about"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Community & Discord</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* COMPANY MEGA MENU (Matching Screenshot 4) */}
              {activeMenu === "company" && (
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Explore Company
                    </p>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/company/about"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/careers"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Careers
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/blog"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          News
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/blog"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Stories
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/about"
                          onClick={() => setActiveMenu(null)}
                          className="text-2xl font-medium text-foreground hover:opacity-70 transition-opacity"
                        >
                          Supply Co.
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Resources
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>
                        <Link
                          href="/company/about"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Brand Guidelines
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/support/privacy"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Public Policy & Governance
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/support/terms"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Terms of Service
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/support/privacy"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* MOBILE NAVIGATION DRAWER                                         */}
        {/* ---------------------------------------------------------------- */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 bottom-0 bg-background border-b border-border p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in-0 duration-150 z-50">
            <div className="space-y-6">
              <div className="space-y-4">
                <Link
                  href="/research/overview"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-xl font-medium text-foreground"
                >
                  Research
                </Link>
                <Link
                  href="/product/features"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-xl font-medium text-foreground"
                >
                  Products
                </Link>
                <Link
                  href="/business/enterprise"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-xl font-medium text-foreground"
                >
                  Business
                </Link>
                <Link
                  href="/product/api-docs"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-xl font-medium text-foreground"
                >
                  Developers
                </Link>
                <Link
                  href="/company/about"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-xl font-medium text-foreground"
                >
                  Company
                </Link>
                <Link
                  href="/foundation"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-xl font-medium text-foreground"
                >
                  Foundation
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              {user ? (
                <Button asChild className="w-full rounded-full bg-foreground text-background">
                  <Link href="/c" onClick={() => setMobileNavOpen(false)}>
                    Go to Chat
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full rounded-full border-border">
                    <Link href="/auth/login" onClick={() => setMobileNavOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-full bg-foreground text-background">
                    <Link href="/c" onClick={() => setMobileNavOpen(false)}>
                      Try ayoAI
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default MarketingHeader;
