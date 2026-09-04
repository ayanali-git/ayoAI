"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowUp,
  ArrowLeft,
  PanelRight,
  PanelLeft,
  Menu,
} from "lucide-react";
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

type MegaMenuCategory =
  | "research"
  | "products"
  | "business"
  | "developers"
  | "company"
  | "login"
  | "account"
  | null;

export function MarketingHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MegaMenuCategory>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<MegaMenuCategory>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loginTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAccountEnter = () => {
    if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
    setAccountMenuOpen(true);
  };

  const handleAccountLeave = () => {
    if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
    accountTimeoutRef.current = setTimeout(() => {
      setAccountMenuOpen(false);
    }, 200);
  };

  const handleLoginEnter = () => {
    if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
    setLoginMenuOpen(true);
  };

  const handleLoginLeave = () => {
    if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
    loginTimeoutRef.current = setTimeout(() => {
      setLoginMenuOpen(false);
    }, 200);
  };

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
          "fixed inset-0 top-14 z-40 bg-background/98 backdrop-blur-2xl animate-in fade-in-0 duration-200 pointer-events-none",
          activeMenu ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
        onClick={() => setActiveMenu(null)}
      />

      {/* FULLSCREEN SEARCH OVERLAY */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-background/98 backdrop-blur-2xl flex flex-col items-center pt-24 px-6 animate-in fade-in-0 duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchOpen(false);
            }
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="w-full flex items-center justify-between border-b border-border pb-3">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about research, models, pricing..."
                className="w-full bg-transparent text-2xl sm:text-3xl text-foreground font-normal placeholder:text-muted-foreground outline-none border-none ring-0"
              />
              <div className="flex items-center gap-2 shrink-0 pl-4">
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
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
              onMouseEnter={() => setActiveMenu(null)}
              onClick={() => {
                setActiveMenu(null);
                setIsSearchOpen(false);
              }}
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <span className="font-bold text-[17px] tracking-tight text-foreground">
                ayoAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Research */}
              <button
                onMouseEnter={() => handleMouseEnter("research")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "research" ? null : "research");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer flex items-center gap-1",
                  activeMenu === "research"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Research</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeMenu === "research" && "rotate-180"
                  )}
                />
              </button>

              {/* Products */}
              <button
                onMouseEnter={() => handleMouseEnter("products")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "products" ? null : "products");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer flex items-center gap-1",
                  activeMenu === "products"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Products</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeMenu === "products" && "rotate-180"
                  )}
                />
              </button>

              {/* Business */}
              <button
                onMouseEnter={() => handleMouseEnter("business")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "business" ? null : "business");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer flex items-center gap-1",
                  activeMenu === "business"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Business</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeMenu === "business" && "rotate-180"
                  )}
                />
              </button>

              {/* Developers */}
              <button
                onMouseEnter={() => handleMouseEnter("developers")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(
                    activeMenu === "developers" ? null : "developers"
                  );
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer flex items-center gap-1",
                  activeMenu === "developers"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Developers</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeMenu === "developers" && "rotate-180"
                  )}
                />
              </button>

              {/* Company */}
              <button
                onMouseEnter={() => handleMouseEnter("company")}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveMenu(activeMenu === "company" ? null : "company");
                }}
                className={cn(
                  "text-[13.5px] font-medium transition-colors py-1 cursor-pointer flex items-center gap-1",
                  activeMenu === "company"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Company</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeMenu === "company" && "rotate-180"
                  )}
                />
              </button>

              {/* Foundation (Non-dropdown link: closes menu immediately on hover) */}
              <Link
                href="/foundation"
                onMouseEnter={() => setActiveMenu(null)}
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
                  onMouseEnter={() => setActiveMenu(null)}
                  onClick={() => setIsSearchOpen(false)}
                  className="text-foreground hover:opacity-80 p-1 transition-opacity cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onMouseEnter={() => setActiveMenu(null)}
                  onClick={() => {
                    setActiveMenu(null);
                    setIsSearchOpen(true);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </nav>
          </div>

          {/* Right CTA Actions */}
          <div
            className="hidden lg:flex items-center gap-3"
            onMouseEnter={() => setActiveMenu(null)}
          >
            {user ? (
              <>
                <div
                  onMouseEnter={handleAccountEnter}
                  onMouseLeave={handleAccountLeave}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex rounded-full bg-secondary items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 cursor-pointer outline-none select-none"
                  >
                    <span>Account</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        accountMenuOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Zero-flicker Hover Dropdown Bridge */}
                  {accountMenuOpen && (
                    <div
                      onMouseEnter={handleAccountEnter}
                      onMouseLeave={handleAccountLeave}
                      className="absolute right-0 top-full pt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                    >
                      <div className="w-48 rounded-2xl p-1.5 bg-background dark:bg-[#212121] border border-border/80 dark:border-neutral-700/80">
                        <Link
                          href="/c"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-md rounded-xl text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors"
                        >
                          Open Chat
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-md rounded-xl text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors"
                        >
                          Settings
                        </Link>
                        <div className="h-[1px] bg-neutral-200 dark:bg-[#383838] my-1 -mx-1.5" />
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-md rounded-xl text-red-500 hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors text-left cursor-pointer"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

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
                <div
                  onMouseEnter={handleLoginEnter}
                  onMouseLeave={handleLoginLeave}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                    className="flex rounded-full bg-background dark:bg-secondary hover:bg-secondary dark:hover:bg-[#2f2f2f] items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 cursor-pointer outline-none select-none"
                  >
                    <span>Log in</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        loginMenuOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Zero-flicker Hover Dropdown Bridge */}
                  {loginMenuOpen && (
                    <div
                      onMouseEnter={handleLoginEnter}
                      onMouseLeave={handleLoginLeave}
                      className="absolute right-0 top-full pt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                    >
                      <div className="w-52 rounded-2xl p-1.5 bg-background dark:bg-secondary border border-border/80 dark:border-neutral-700/80">
                        <Link
                          href="/auth/login"
                          onClick={() => setLoginMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-md rounded-xl text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors"
                        >
                          Log in to ayoAI
                        </Link>
                        <Link
                          href="/auth/login?type=enterprise"
                          onClick={() => setLoginMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-md rounded-xl text-foreground hover:bg-secondary dark:hover:bg-[#2f2f2f] transition-colors"
                        >
                          Log in to Enterprise
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  asChild
                  className="group rounded-full px-5 h-9 text-[13px] font-medium bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Link href="/c" className="flex items-center">
                    <span>Try now</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle (Panel icon + Search) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setMobileNavOpen(false);
              }}
              className="p-2 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              {isSearchOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => {
                setMobileNavOpen(!mobileNavOpen);
                setMobileSubMenu(null);
              }}
              className="p-2 text-foreground hover:opacity-80 transition-opacity"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? (
                <PanelRight className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* MEGA MENU DROPDOWNS (Desktop Floating Overlay)            */}
        {/* ---------------------------------------------------------------- */}
        {activeMenu && (
          <div
            className="hidden lg:block absolute top-14 left-0 w-full border-b border-border bg-background transition-all duration-150 animate-in fade-in-0 slide-in-from-top-1 z-50"
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Latest Advancements
                    </p>
                    <ul className="space-y-3 text-md text-muted-foreground">
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
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
                          <ArrowUpRight className="w-4 h-4 ml-1.5 text-foreground group-hover:text-foreground" />
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Resources
                    </p>
                    <ul className="space-y-3 text-md text-muted-foreground">
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Products
                    </p>
                    <ul className="space-y-3 text-md text-muted-foreground">
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI Work & Teams
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Codex Enterprise
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
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI Frontier
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          ayoAI Presence
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Daybreak
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Solutions
                    </p>
                    <ul className="space-y-3 text-md text-muted-foreground">
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Finance & Banking
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Data Analytics
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Design & Creative
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Life Sciences & Biotech
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
                          Cybersecurity
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/business/enterprise"
                          onClick={() => setActiveMenu(null)}
                          className="hover:text-foreground transition-colors"
                        >
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
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
                          <ArrowUpRight className="w-4 h-4 ml-1.5 text-foreground group-hover:text-foreground" />
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
                          <ArrowUpRight className="w-4 h-4 ml-1.5 text-foreground group-hover:text-foreground" />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Resources
                    </p>
                    <ul className="space-y-3 text-md text-muted-foreground">
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Docs</span>
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Codex Use Cases</span>
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/product/api-docs"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Cookbook & Recipes</span>
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/blog"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Developer Showcase</span>
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/blog"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Developer Blog</span>
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/company/about"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center hover:text-foreground transition-colors"
                        >
                          <span>Community & Discord</span>
                          <ArrowUpRight className="w-4 h-4 ml-1" />
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
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
                    <p className="text-md font-semibold text-muted-foreground tracking-wider uppercase mb-5">
                      Resources
                    </p>
                    <ul className="space-y-3 text-md text-muted-foreground">
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
        {/* MOBILE NAVIGATION DRAWER                            */}
        {/* ---------------------------------------------------------------- */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 bottom-0 bg-background border-b border-border p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in-0 duration-150 z-50 select-none">
            {mobileSubMenu === null ? (
              /* LEVEL 1: MAIN NAVIGATION LIST (Image 3) */
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-4 pt-2">
                  <button
                    onClick={() => setMobileSubMenu("research")}
                    className="w-full text-left text-3xl sm:text-4xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center justify-between py-1.5"
                  >
                    <span>Research</span>
                  </button>
                  <button
                    onClick={() => setMobileSubMenu("products")}
                    className="w-full text-left text-3xl sm:text-4xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center justify-between py-1.5"
                  >
                    <span>Products</span>
                  </button>
                  <button
                    onClick={() => setMobileSubMenu("business")}
                    className="w-full text-left text-3xl sm:text-4xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center justify-between py-1.5"
                  >
                    <span>Business</span>
                  </button>
                  <button
                    onClick={() => setMobileSubMenu("developers")}
                    className="w-full text-left text-3xl sm:text-4xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center justify-between py-1.5"
                  >
                    <span>Developers</span>
                  </button>
                  <button
                    onClick={() => setMobileSubMenu("company")}
                    className="w-full text-left text-3xl sm:text-4xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center justify-between py-1.5"
                  >
                    <span>Company</span>
                  </button>
                  <Link
                    href="/foundation"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center gap-1.5 text-3xl sm:text-4xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1.5"
                  >
                    <span>Foundation</span>
                    <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                  </Link>
                </div>

                <div className="pt-8 border-t border-border/50 space-y-4 pb-4">
                  <Link
                    href="/c"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center gap-1.5 text-3xl sm:text-4xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                  >
                    <span>Try now</span>
                    <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                  </Link>
                  {user ? (
                    <button
                      onClick={() => setMobileSubMenu("account")}
                      className="block text-3xl sm:text-4xl font-medium text-foreground hover:opacity-80 transition-opacity py-1 text-left w-full cursor-pointer"
                    >
                      Account
                    </button>
                  ) : (
                    <button
                      onClick={() => setMobileSubMenu("login")}
                      className="block text-3xl sm:text-4xl font-medium text-muted-foreground hover:text-foreground transition-colors py-1 text-left w-full cursor-pointer"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* LEVEL 2: CATEGORY SUBMENU (Image 5) */
              <div className="flex flex-col h-full justify-between animate-in fade-in-0 slide-in-from-right-4 duration-150">
                <div className="space-y-6">
                  {/* Top Back Navigation Button */}
                  <button
                    onClick={() => setMobileSubMenu(null)}
                    className="flex items-center gap-2 text-base font-medium text-foreground hover:opacity-80 transition-opacity cursor-pointer mb-6"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Home</span>
                  </button>

                  <div className="text-md uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    {mobileSubMenu}
                  </div>

                  {mobileSubMenu === "research" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {[
                          {
                            label: "Research Index",
                            href: "/research/overview",
                          },
                          {
                            label: "Research Overview",
                            href: "/research/overview",
                          },
                          {
                            label: "Research Residency",
                            href: "/research/overview",
                          },
                          { label: "Safety", href: "/research/overview" },
                          {
                            label: "Economic Research",
                            href: "/research/overview",
                          },
                        ].map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-2xl sm:text-3xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <div className="text-md uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                          Latest Advancements
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { label: "GPT-5.6", href: "/research/overview" },
                            { label: "GPT-5.5", href: "/research/overview" },
                            { label: "GPT-5.4", href: "/research/overview" },
                            {
                              label: "GPT-5.3 Instant",
                              href: "/research/overview",
                            },
                            {
                              label: "GPT-5.3-Codex",
                              href: "/research/overview",
                            },
                          ].map((adv, i) => (
                            <Link
                              key={i}
                              href={adv.href}
                              onClick={() => setMobileNavOpen(false)}
                              className="block text-base font-medium text-foreground hover:opacity-80 transition-opacity"
                            >
                              {adv.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {mobileSubMenu === "products" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {[
                          { label: "ayoAI Web & Chat", href: "/c" },
                          {
                            label: "Canvas & Studio",
                            href: "/product/features",
                          },
                          {
                            label: "Mobile & Voice",
                            href: "/product/features",
                          },
                          {
                            label: "Enterprise Platform",
                            href: "/business/enterprise",
                          },
                        ].map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-2xl sm:text-3xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <div className="text-md uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                          Platforms & Capabilities
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { label: "Search & Deep Browse", href: "/c" },
                            {
                              label: "Advanced Code Engine",
                              href: "/product/features",
                            },
                            {
                              label: "Generative Audio & Speech",
                              href: "/product/features",
                            },
                          ].map((adv, i) => (
                            <Link
                              key={i}
                              href={adv.href}
                              onClick={() => setMobileNavOpen(false)}
                              className="block text-base font-medium text-foreground hover:opacity-80 transition-opacity"
                            >
                              {adv.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {mobileSubMenu === "business" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {[
                          {
                            label: "Enterprise Overview",
                            href: "/business/enterprise",
                          },
                          { label: "Pricing & Tiers", href: "/upgrade" },
                          {
                            label: "Security & Privacy",
                            href: "/support/privacy",
                          },
                          {
                            label: "Compliance & Safety",
                            href: "/research/overview",
                          },
                        ].map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-2xl sm:text-3xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <div className="text-md uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                          Industry Solutions
                        </div>
                        <div className="space-y-2.5">
                          {[
                            {
                              label: "Engineering & Codebases",
                              href: "/business/enterprise",
                            },
                            {
                              label: "Financial Services",
                              href: "/business/enterprise",
                            },
                            {
                              label: "Healthcare & Biotech",
                              href: "/business/enterprise",
                            },
                          ].map((adv, i) => (
                            <Link
                              key={i}
                              href={adv.href}
                              onClick={() => setMobileNavOpen(false)}
                              className="block text-base font-medium text-foreground hover:opacity-80 transition-opacity"
                            >
                              {adv.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {mobileSubMenu === "developers" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {[
                          { label: "API Overview", href: "/product/api-docs" },
                          { label: "Documentation", href: "/product/api-docs" },
                          {
                            label: "Pricing Calculator",
                            href: "/product/api-docs",
                          },
                          {
                            label: "Developer Community",
                            href: "/product/api-docs",
                          },
                        ].map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-2xl sm:text-3xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <div className="text-md uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                          Libraries & SDKs
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { label: "Python SDK", href: "/product/api-docs" },
                            {
                              label: "TypeScript SDK",
                              href: "/product/api-docs",
                            },
                            {
                              label: "REST API Reference",
                              href: "/product/api-docs",
                            },
                          ].map((adv, i) => (
                            <Link
                              key={i}
                              href={adv.href}
                              onClick={() => setMobileNavOpen(false)}
                              className="block text-base font-medium text-foreground hover:opacity-80 transition-opacity"
                            >
                              {adv.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {mobileSubMenu === "company" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {[
                          { label: "About ayoAI", href: "/company/about" },
                          { label: "News & Releases", href: "/company/blog" },
                          { label: "Careers", href: "/company/careers" },
                          { label: "Security", href: "/company/contact" },
                        ].map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-2xl sm:text-3xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <div className="text-md uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                          Legal & Trust
                        </div>
                        <div className="space-y-2.5">
                          {[
                            {
                              label: "Terms of Service",
                              href: "/support/terms",
                            },
                            {
                              label: "Privacy Policy",
                              href: "/support/privacy",
                            },
                            { label: "Contact Us", href: "/company/contact" },
                          ].map((adv, i) => (
                            <Link
                              key={i}
                              href={adv.href}
                              onClick={() => setMobileNavOpen(false)}
                              className="block text-base font-medium text-foreground hover:opacity-80 transition-opacity"
                            >
                              {adv.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {mobileSubMenu === "login" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {[
                          { label: "Log in to ayoAI", href: "/auth/login" },
                          {
                            label: "Log in to Enterprise",
                            href: "/auth/login?type=enterprise",
                          },
                        ].map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-2xl sm:text-3xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <div className="text-md uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                          Don&apos;t have an account?
                        </div>
                        <div className="space-y-2.5">
                          <Link
                            href="/auth/signup"
                            onClick={() => setMobileNavOpen(false)}
                            className="flex items-center gap-1.5 text-lg font-medium text-foreground hover:opacity-80 transition-opacity"
                          >
                            <span>Sign up for now</span>
                            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {mobileSubMenu === "account" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {[
                          { label: "Open Chat", href: "/c" },
                          { label: "Settings & Profile", href: "/settings" },
                          { label: "Upgrade Plan", href: "/upgrade" },
                        ].map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-2xl sm:text-3xl font-medium tracking-tight text-foreground hover:opacity-80 transition-opacity py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <button
                          type="button"
                          onClick={() => {
                            signOut();
                            setMobileNavOpen(false);
                          }}
                          className="block text-xl font-medium text-red-500 hover:opacity-80 transition-opacity py-1 cursor-pointer"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}

export default MarketingHeader;
