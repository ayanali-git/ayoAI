'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedArrowProps {
  className?: string;
  size?: number;
}

/**
 * Animated Chevron to Arrow on Hover
 * Initially renders a Chevron Right (>).
 * On hover, a horizontal stem line emerges from the chevron tip,
 * seamlessly transforming the chevron into an Arrow Right (->).
 */
export function AnimatedArrow({ className, size = 16 }: AnimatedArrowProps) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center w-4 h-4 ml-1.5 shrink-0 select-none overflow-visible',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="overflow-visible text-current"
      >
        {/* Horizontal stem line: expands from right to left on hover */}
        <line
          x1="4"
          y1="12"
          x2="15"
          y2="12"
          className="origin-right transition-all duration-200 ease-out opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-hover:translate-x-1"
        />
        {/* Chevron tip: connects with the horizontal stem line on hover */}
        <path
          d="m10 6 6 6-6 6"
          className="transition-transform duration-200 ease-out group-hover:translate-x-1"
        />
      </svg>
    </span>
  );
}

export default AnimatedArrow;
