'use client';

import { useTheme } from 'next-themes';
import { GoeyToaster } from 'goey-toast';

export function ToasterProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <GoeyToaster
      position="top-center"
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      preset="snappy"
      showTimestamp={false}
    />
  );
}
