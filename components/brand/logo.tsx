import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function AyoAIIcon({ className = 'w-6 h-6 text-foreground', size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 4.5C14.5 7.5 17 9.5 19.5 12C17 14.5 14.5 16.5 12 19.5C9.5 16.5 7 14.5 4.5 12C7 9.5 9.5 7.5 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
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
