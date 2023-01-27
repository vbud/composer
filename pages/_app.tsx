import React from 'react';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';

import AppErrorBoundary from 'src/AppErrorBoundary';
import { AppContextProvider } from 'src/contexts/AppContext';

import 'src/globals.css';

const Wrapper = (props: { children: React.ReactNode }) => (
  <React.Fragment>{props.children}</React.Fragment>
);

const NonSSRWrapper = dynamic(() => Promise.resolve(Wrapper), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NonSSRWrapper>
      <AppErrorBoundary>
        <AppContextProvider>
          <Component {...pageProps} />
        </AppContextProvider>
      </AppErrorBoundary>
    </NonSSRWrapper>
  );
}
