'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedArrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: number;
}

/**
 * Animated Chevron to Arrow on Hover (Exact x.ai / SpaceXAI design)
 * 
 * At rest (idle):
 * - Displays a clean right-pointing chevron (>).
 * 
 * On hover:
 * - The chevron vertex smoothly shifts slightly forward (15 -> 18)
 * - The arrow stem line emerges from the chevron vertex and expands backward to the left (15 -> 9)
 * - Stem opacity smoothly transitions from 0 to 1
 * - Powered by spring physics: stiffness 500, damping 30
 */
export function AnimatedArrow({ className, size = 16, style, ...props }: AnimatedArrowProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parentGroup = el.closest('.group') || el;
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    parentGroup.addEventListener('mouseenter', onEnter);
    parentGroup.addEventListener('mouseleave', onLeave);
    return () => {
      parentGroup.removeEventListener('mouseenter', onEnter);
      parentGroup.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const motionVal = useMotionValue(+!!hovered);
  const spring = useSpring(motionVal, { stiffness: 500, damping: 30 });

  useEffect(() => {
    motionVal.set(+!!hovered);
  }, [hovered, motionVal]);

  // Stem line (y=12): emerges from x=15 backward to x=5, while right end follows vertex from 15 to 19
  const p = useTransform(spring, [0, 1], [15, 5]);
  const h = useTransform(spring, [0, 1], [15, 19]);
  const m = useTransform(spring, [0, 0.08, 1], [0, 0.8, 1]);

  // Top arm of chevron: goes from (9, 6) to (15, 12) at rest -> (13, 6) to (19, 12) on hover
  // (Identical to Lucide ChevronRight at rest and Lucide ArrowRight on hover)
  const f = useTransform(spring, [0, 1], [9, 13]);
  const y = useTransform(spring, [0, 1], [15, 19]);

  // Bottom arm of chevron: goes from (9, 18) to (15, 12) at rest -> (13, 18) to (19, 12) on hover
  const v = useTransform(spring, [0, 1], [9, 13]);
  const g = useTransform(spring, [0, 1], [15, 19]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center shrink-0 ml-1 select-none pointer-events-none',
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full overflow-visible"
      >
        <motion.line x1={p} y1={12} x2={h} y2={12} style={{ opacity: m }} />
        <motion.line x1={f} y1={6} x2={y} y2={12} />
        <motion.line x1={v} y1={18} x2={g} y2={12} />
      </svg>
    </span>
  );
}

export default AnimatedArrow;
