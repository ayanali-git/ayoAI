"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/ui/footer";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { ArrowUpRight, ArrowRight, Sparkles, ArrowUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const [heroPrompt, setHeroPrompt] = useState("");

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroPrompt.trim()) {
      router.push("/c");
      return;
    }
    router.push(`/c?q=${encodeURIComponent(heroPrompt)}`);
  };

  const quickPills = [
    { label: "Find a model for coding", prompt: "What is the best ayoAI model for software engineering and coding?" },
    { label: "API pricing", prompt: "Explain the API pricing tiers and token costs" },
    { label: "Safety index", prompt: "What are the latest safety evaluations and benchmarks for frontier models?" },
    { label: "Explore careers", prompt: "What engineering and research roles are open at ayoAI?" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col select-none antialiased">
      <MarketingHeader />

      <main className="flex-1">
        {/* ---------------------------------------------------------------- */}
        {/* HERO PROMPT DOCK (OpenAI Style Search / Chat Trigger)            */}
        {/* ---------------------------------------------------------------- */}
        <section className="pt-20 pb-14 px-6 sm:px-8 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
            What can I help you find?
          </h1>

          {/* Floating Search Pill Bar */}
          <form onSubmit={handleHeroSubmit} className="relative max-w-2xl mx-auto mb-4">
            <div className="flex items-center w-full h-14 pl-5 pr-2.5 rounded-full border border-border/80 bg-card transition-all shadow-lg">
              <input
                type="text"
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                placeholder="Ask about research, models, pricing, capabilities..."
                className="w-full bg-transparent text-[14.5px] text-foreground placeholder:text-muted-foreground/60 outline-none border-none ring-0"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                  aria-label="Send prompt"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Suggestion Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {quickPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => {
                  setHeroPrompt(pill.prompt);
                  router.push(`/c?q=${encodeURIComponent(pill.prompt)}`);
                }}
                className="px-3.5 py-1.5 rounded-full border border-border/70 bg-secondary/40 hover:bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FEATURED BILLBOARD GRID (GPT-5.6 / Frontier Spotlight)          */}
        {/* ---------------------------------------------------------------- */}
        <section className="px-6 sm:px-8 max-w-[1400px] mx-auto pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Massive Main Feature Card (8 cols) */}
            <Link
              href="/research/overview"
              className="group lg:col-span-8 relative rounded-3xl overflow-hidden min-h-[480px] sm:min-h-[540px] flex flex-col justify-between p-8 sm:p-12 border border-border/50 bg-[#0c0c0e] text-white transition-all duration-300"
            >
              {/* Cosmic Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-black z-0" />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

              {/* Big Watermark Title */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter opacity-90">
                    GPT 5.6
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Headline & Link at Bottom */}
              <div className="relative z-10 max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2 leading-snug">
                  GPT-5.6: Frontier intelligence that scales with your ambition
                </h2>
                <p className="text-sm text-neutral-300 mb-4 line-clamp-2">
                  Our most versatile reasoning model yet, delivering unprecedented breakthroughs across code generation, mathematical analysis, and creative synthesis.
                </p>
                <div className="inline-flex items-center text-xs font-semibold text-white uppercase tracking-wider">
                  <span>Read announcement</span>
                  <AnimatedArrow size={14} className="ml-1.5 text-white" />
                </div>
              </div>
            </Link>

            {/* Stack of 3 Side Cards (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Side Card 1 */}
              <Link
                href="/research/overview"
                className="group relative rounded-3xl p-6 border border-border/50 bg-[#121214] text-white flex-1 flex flex-col justify-between overflow-hidden transition-colors hover:border-border"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-950/20 to-transparent z-0" />
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold tracking-wider text-orange-400 uppercase">
                    Research
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-white group-hover:underline leading-snug mb-1">
                    Introducing the Next-Gen Frontier Reasoning Architecture
                  </h3>
                  <p className="text-xs text-neutral-400">August 2026</p>
                </div>
              </Link>

              {/* Side Card 2 */}
              <Link
                href="/product/features"
                className="group relative rounded-3xl p-6 border border-border/50 bg-[#121214] text-white flex-1 flex flex-col justify-between overflow-hidden transition-colors hover:border-border"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 to-transparent z-0" />
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
                    Product
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-white group-hover:underline leading-snug mb-1">
                    ayoAI Mobile & Voice: Real-time interactive canvas
                  </h3>
                  <p className="text-xs text-neutral-400">August 2026</p>
                </div>
              </Link>

              {/* Side Card 3 */}
              <Link
                href="/product/features"
                className="group relative rounded-3xl p-6 border border-border/50 bg-[#121214] text-white flex-1 flex flex-col justify-between overflow-hidden transition-colors hover:border-border"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-950/20 to-transparent z-0" />
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold tracking-wider text-pink-400 uppercase">
                    Creative
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-white group-hover:underline leading-snug mb-1">
                    Launching Advanced Generative Studio & Canvas
                  </h3>
                  <p className="text-xs text-neutral-400">August 2026</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* LATEST NEWS & UPDATES (OpenAI Grid)                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="px-6 sm:px-8 max-w-[1400px] mx-auto py-12 border-t border-border/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Latest News
            </h2>
            <Link
              href="/company/blog"
              className="group inline-flex items-center text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              <span>View news</span>
              <AnimatedArrow size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Global partnership for frontier AI research infrastructure",
                category: "Company",
                date: "Aug 20, 2026",
                color: "from-blue-600 via-indigo-600 to-purple-800",
              },
              {
                title: "Frontier safety commitments and verifiable alignment benchmarks",
                category: "Research",
                date: "Aug 18, 2026",
                color: "from-amber-500 via-orange-600 to-red-700",
              },
              {
                title: "New benchmark records on SWE-bench and Olympiad mathematics",
                category: "Research",
                date: "Aug 14, 2026",
                color: "from-emerald-500 via-teal-600 to-cyan-800",
              },
              {
                title: "Advancements in live audio synthesis and spatial perception",
                category: "Product",
                date: "Aug 10, 2026",
                color: "from-cyan-500 via-sky-600 to-blue-800",
              },
              {
                title: "Enterprise privacy safeguards with zero unauthorized retention",
                category: "Company",
                date: "Aug 06, 2026",
                color: "from-fuchsia-500 via-pink-600 to-rose-800",
              },
              {
                title: "Expanding developer grants for open frontier research",
                category: "Foundation",
                date: "Aug 01, 2026",
                color: "from-violet-500 via-purple-600 to-indigo-900",
              },
            ].map((news, i) => (
              <Link
                key={i}
                href="/company/blog"
                className="group flex flex-col rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-border transition-all"
              >
                {/* Visual Thumbnail */}
                <div className={`h-40 w-full bg-gradient-to-br ${news.color} opacity-85 group-hover:opacity-100 transition-opacity flex items-end p-4`}>
                  <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                    {news.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="text-base font-medium text-foreground group-hover:underline leading-snug mb-3">
                    {news.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{news.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* STORIES & REAL-WORLD IMPACT (OpenAI 3-Column Stories)            */}
        {/* ---------------------------------------------------------------- */}
        <section className="px-6 sm:px-8 max-w-[1400px] mx-auto py-12 border-t border-border/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Stories
            </h2>
            <Link
              href="/company/blog"
              className="group inline-flex items-center text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              <span>View all</span>
              <AnimatedArrow size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Scaling exploration across polar science & climate dynamics",
                category: "Science",
                gradient: "from-sky-900 via-indigo-950 to-black",
                date: "July 2026",
              },
              {
                title: "Coding intelligence accelerated in high-velocity teams",
                category: "Engineering",
                gradient: "from-stone-900 via-neutral-900 to-black",
                date: "July 2026",
              },
              {
                title: "Next-generation motorsport aerodynamic engineering with ayoAI",
                category: "Industry",
                gradient: "from-red-950 via-neutral-950 to-black",
                date: "June 2026",
              },
            ].map((story, i) => (
              <Link
                key={i}
                href="/company/blog"
                className="group rounded-3xl overflow-hidden border border-border/50 bg-[#0f0f11] text-white flex flex-col justify-between min-h-[360px] p-7 relative transition-all hover:border-border"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${story.gradient} opacity-90 z-0`} />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    {story.category}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white group-hover:underline leading-snug mb-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-neutral-400">{story.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FRONTIER RESEARCH SHOWCASE                                       */}
        {/* ---------------------------------------------------------------- */}
        <section className="px-6 sm:px-8 max-w-[1400px] mx-auto py-12 border-t border-border/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Frontier Research
            </h2>
            <Link
              href="/research/overview"
              className="group inline-flex items-center text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              <span>View research</span>
              <AnimatedArrow size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/research/overview"
              className="group rounded-3xl p-7 border border-border/50 bg-[#0e1118] text-white flex flex-col justify-between min-h-[300px] hover:border-border transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:underline leading-snug mb-2">
                  The next generation model architecture and self-verifying chains
                </h3>
                <p className="text-xs text-neutral-400">Research Paper • August 2026</p>
              </div>
            </Link>

            <Link
              href="/research/overview"
              className="group rounded-3xl p-7 border border-border/50 bg-[#16140e] text-white flex flex-col justify-between min-h-[300px] hover:border-border transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 font-mono font-bold text-sm">
                n²·Δ
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:underline leading-snug mb-2">
                  Unit Distance Problem & Discrete Mathematics Optimization
                </h3>
                <p className="text-xs text-neutral-400">Research Paper • July 2026</p>
              </div>
            </Link>

            <Link
              href="/research/overview"
              className="group rounded-3xl p-7 border border-border/50 bg-[#0e1713] text-white flex flex-col justify-between min-h-[300px] hover:border-border transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 font-mono font-bold text-xs">
                DNA·8
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:underline leading-snug mb-2">
                  Introducing ayoAI-Rosalind for Molecular Biology & Therapeutics
                </h3>
                <p className="text-xs text-neutral-400">Research Paper • July 2026</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* BUSINESS & ENTERPRISE PARTNERS (OpenAI Style Textured Cards)    */}
        {/* ---------------------------------------------------------------- */}
        <section className="px-6 sm:px-8 max-w-[1400px] mx-auto py-12 border-t border-border/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              ayoAI for Business
            </h2>
            <Link
              href="/business/enterprise"
              className="group inline-flex items-center text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              <span>Explore enterprise</span>
              <AnimatedArrow size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/business/enterprise"
              className="group rounded-3xl p-8 border border-border/50 bg-gradient-to-br from-[#7a6438] via-[#4d3d1f] to-[#1e1709] text-white flex flex-col justify-between min-h-[280px] hover:scale-[1.01] transition-all shadow-lg"
            >
              <span className="text-2xl font-bold tracking-tight">Model ML</span>
              <div>
                <p className="text-sm font-medium text-neutral-200 group-hover:underline mb-1">
                  Accelerating deep learning experimentation with ayoAI infrastructure
                </p>
                <p className="text-xs text-neutral-300">Case study</p>
              </div>
            </Link>

            <Link
              href="/business/enterprise"
              className="group rounded-3xl p-8 border border-border/50 bg-gradient-to-br from-[#2e333d] via-[#1a1d24] to-[#0c0e12] text-white flex flex-col justify-between min-h-[280px] hover:scale-[1.01] transition-all shadow-lg"
            >
              <span className="text-2xl font-bold tracking-tight">Global Bank</span>
              <div>
                <p className="text-sm font-medium text-neutral-200 group-hover:underline mb-1">
                  Scaling private institutional financial analysis with frontier security
                </p>
                <p className="text-xs text-neutral-300">Case study</p>
              </div>
            </Link>

            <Link
              href="/business/enterprise"
              className="group rounded-3xl p-8 border border-border/50 bg-gradient-to-br from-[#d95d1e] via-[#8c350a] to-[#2b0f02] text-white flex flex-col justify-between min-h-[280px] hover:scale-[1.01] transition-all shadow-lg"
            >
              <span className="text-2xl font-bold tracking-tight">_zapier</span>
              <div>
                <p className="text-sm font-medium text-neutral-200 group-hover:underline mb-1">
                  Empowering millions with autonomous multi-agent task execution
                </p>
                <p className="text-xs text-neutral-300">Case study</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* BOTTOM CALL TO ACTION BANNER (Dark OpenAI Container)             */}
        {/* ---------------------------------------------------------------- */}
        <section className="px-6 sm:px-8 max-w-[1400px] mx-auto py-16">
          <div className="rounded-3xl border border-border/60 bg-card p-12 sm:p-16 text-center flex flex-col items-center justify-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
              Get started with ayoAI
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md">
              Experience the frontier intelligence designed to think, create, and build alongside you.
            </p>
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="group rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Link href="/c" className="flex items-center">
                  <span>Start chatting</span>
                  <AnimatedArrow size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
