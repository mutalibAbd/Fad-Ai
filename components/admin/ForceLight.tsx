'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

export default function ForceLight() {
  const { setTheme, theme } = useTheme();
  const prev = useRef<string | undefined>(undefined);

  useEffect(() => {
    prev.current = theme;
    setTheme('light');

    return () => {
      if (prev.current && prev.current !== 'light') {
        setTheme(prev.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
