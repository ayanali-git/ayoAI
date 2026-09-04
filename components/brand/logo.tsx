import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  inverted?: boolean;
}

export function AyoAIIcon({ className = 'w-6 h-6', size = 24, inverted = false }: LogoProps) {
  const isInverted = inverted || className.includes('text-background');

  return (
    <span
      style={{ width: size, height: size }}
      className={cn("inline-flex items-center justify-center shrink-0 select-none", className)}
    >
      {isInverted ? (
        <>
          <img
            src="/ayoai-icon-white.png"
            alt="ayoAI"
            width={size}
            height={size}
            className="w-full h-full object-contain dark:hidden"
          />
          <img
            src="/ayoai-icon.png"
            alt="ayoAI"
            width={size}
            height={size}
            className="w-full h-full object-contain hidden dark:block"
          />
        </>
      ) : (
        <>
          <img
            src="/ayoai-icon.png"
            alt="ayoAI"
            width={size}
            height={size}
            className="w-full h-full object-contain dark:hidden"
          />
          <img
            src="/ayoai-icon-white.png"
            alt="ayoAI"
            width={size}
            height={size}
            className="w-full h-full object-contain hidden dark:block"
          />
        </>
      )}
    </span>
  );
}

export function AyoAILogo({ className = 'flex items-center gap-2.5', iconSize = 22 }: { className?: string; iconSize?: number }) {
  return (
    <div className={className}>
      <AyoAIIcon size={iconSize} />
      <span className="font-semibold text-[17px] tracking-tight text-foreground select-none">
        ayoAI
      </span>
    </div>
  );
}
