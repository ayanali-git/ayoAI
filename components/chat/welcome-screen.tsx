"use client";

import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  Image,
  Code,
  PenTool,
  Sparkles,
  FileSearch,
  Lightbulb,
  Compass,
  GraduationCap,
} from "lucide-react";

interface WelcomeScreenProps {
  user?: User | null;
  onPromptSelect?: (prompt: string) => void;
  children?: React.ReactNode;
}

const GREETING_TITLES = [
  "Where should we begin?",
  "What can I help with today?",
  "What’s on your mind?",
  "Where shall we start?",
  "What would you like to explore?",
  "How can I help you today?",
  "What are we working on today?",
  "What idea are we exploring today?",
  "What do you want to create?",
];

export function WelcomeScreen({
  user,
  onPromptSelect,
  children,
}: WelcomeScreenProps) {
  const [dynamicTitle, setDynamicTitle] = useState<string>(
    "Where should we begin?"
  );

  useEffect(() => {
    // Pick a random dynamic title on mount
    const randomIndex = Math.floor(Math.random() * GREETING_TITLES.length);
    setDynamicTitle(GREETING_TITLES[randomIndex]);
  }, []);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center select-none pb-6 sm:pb-8">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center space-y-6">
        {/* Dynamic Title */}
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground/90 animate-in fade-in-50 duration-300">
          {dynamicTitle}
        </h1>

        {/* Centered Floating Input Bar (Passed as child or embedded) */}
        {children && <div className="w-full">{children}</div>}
      </div>
    </div>
  );
}

export default WelcomeScreen;
