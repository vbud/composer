import { useEffect } from 'react';

import { useStore } from 'src/store';
import { darkModeDataAttribute } from 'src/globals.css';

export type ColorScheme = 'light' | 'dark' | 'system';
const applyColorScheme = (colorScheme: Exclude<ColorScheme, 'system'>) => {
  document.documentElement[
    colorScheme === 'dark' ? 'setAttribute' : 'removeAttribute'
  ](darkModeDataAttribute, '');
};

export function useColorScheme() {
  const colorScheme = useStore((s) => s.colorScheme);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    if (colorScheme === 'system') {
      const handler = (e: MediaQueryListEvent) => {
        applyColorScheme(e.matches ? 'dark' : 'light');
      };
      mq.addEventListener('change', handler);
      applyColorScheme(mq.matches ? 'dark' : 'light');

      return () => {
        mq.removeEventListener('change', handler);
      };
    }

    applyColorScheme(colorScheme);
  }, [colorScheme]);
}
