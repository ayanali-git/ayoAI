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

export interface AnimatedChevronProps extends React.SVGAttributes<SVGSVGElement> {
  open?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Animated Chevron Morph on Hover / Open (Exact x.ai / SpaceXAI design)
 * 
 * At rest (idle down chevron):
 * - Displays a clean downward-pointing polyline points: "4,6 8,10 12,6".
 * 
 * On hover or when open=true (upward chevron):
 * - Center vertex smoothly glides upward from y=10 to y=6
 * - Outer arms glide downward from y=6 to y=10 ("4,10 8,6 12,10")
 * - Driven by spring physics: stiffness 400, damping 30
 */
export function AnimatedChevron({
  open,
  className,
  size = 14,
  strokeWidth = 1.75,
  style,
  ...props
}: AnimatedChevronProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parentGroup = el.closest('.group') || el.closest('button') || el.closest('a') || el;
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    parentGroup.addEventListener('mouseenter', onEnter);
    parentGroup.addEventListener('mouseleave', onLeave);
    return () => {
      parentGroup.removeEventListener('mouseenter', onEnter);
      parentGroup.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const isActive = Boolean(open || hovered);
  const motionVal = useMotionValue(+!!isActive);
  const spring = useSpring(motionVal, { stiffness: 400, damping: 30 });

  useEffect(() => {
    motionVal.set(+!!isActive);
  }, [isActive, motionVal]);

  const vertexY = useTransform(spring, [0, 1], [10, 6]);
  const armsY = useTransform(spring, [0, 1], [6, 10]);
  const points = useTransform(
    [armsY, vertexY],
    ([arms, vertex]) => `4,${arms} 8,${vertex} 12,${arms}`
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'inline-block shrink-0 overflow-visible select-none pointer-events-none transition-colors',
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <motion.polyline points={points} />
    </svg>
  );
}

export { AnimatedChevron as AnimatedChevronDown };

export interface AnimatedSearchCloseProps extends React.HTMLAttributes<HTMLSpanElement> {
  open?: boolean;
  isOpen?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Animated Search to Close Toggle Icon (OpenAI-style)
 *
 * Uses a single stroked SVG so the search handle becomes one close arm while
 * the lens retracts and the second close arm draws into place.
 */
export function AnimatedSearchClose({
  open,
  isOpen,
  className,
  size = 16,
  strokeWidth = 1.7,
  style,
  ...props
}: AnimatedSearchCloseProps) {
  const active = Boolean(open ?? isOpen);
  const motionVal = useMotionValue(+active);
  const spring = useSpring(motionVal, { stiffness: 520, damping: 38, mass: 0.7 });

  useEffect(() => {
    motionVal.set(+active);
  }, [active, motionVal]);

  const lensRadius = useTransform(spring, [0, 0.45, 0.8, 1], [4.15, 4.15, 0.5, 0]);
  const lensOpacity = useTransform(spring, [0, 0.52, 0.8], [1, 1, 0]);

  const mainX1 = useTransform(spring, [0, 1], [10.1, 4.75]);
  const mainY1 = useTransform(spring, [0, 1], [10.1, 4.75]);
  const mainX2 = useTransform(spring, [0, 1], [13.1, 11.25]);
  const mainY2 = useTransform(spring, [0, 1], [13.1, 11.25]);

  const crossX1 = useTransform(spring, [0, 0.42, 1], [8, 8, 11.25]);
  const crossY1 = useTransform(spring, [0, 0.42, 1], [8, 8, 4.75]);
  const crossX2 = useTransform(spring, [0, 0.42, 1], [8, 8, 4.75]);
  const crossY2 = useTransform(spring, [0, 0.42, 1], [8, 8, 11.25]);
  const crossOpacity = useTransform(spring, [0, 0.35, 0.62], [0, 0, 1]);

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 select-none pointer-events-none overflow-hidden',
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <motion.svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 w-full h-full"
      >
        <motion.circle cx="6.95" cy="6.95" r={lensRadius} style={{ opacity: lensOpacity }} />
        <motion.line x1={mainX1} y1={mainY1} x2={mainX2} y2={mainY2} />
        <motion.line
          x1={crossX1}
          y1={crossY1}
          x2={crossX2}
          y2={crossY2}
          style={{ opacity: crossOpacity }}
        />
      </motion.svg>
    </span>
  );
}

export { AnimatedSearchClose as AnimatedSearchIcon };

export default AnimatedArrow;


