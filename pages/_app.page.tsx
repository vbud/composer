import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';

import AppErrorBoundary from 'src/AppErrorBoundary';
import { useColorScheme } from 'src/utils/colorScheme';

import 'src/globals.css';

// Everything that happens in this component and its descendants will not render
// on the server, meaning, for example, that you can rely on document and window
// being available.
function NonSSRApp({ children }: { children: ReactElement }) {
  useColorScheme();

  return <AppErrorBoundary>{children}</AppErrorBoundary>;
}

const NonSSRWrapper = dynamic(() => Promise.resolve(NonSSRApp), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NonSSRWrapper>
      <Component {...pageProps} />
    </NonSSRWrapper>
  );
}
