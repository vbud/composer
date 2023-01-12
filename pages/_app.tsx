import React from 'react';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';

import { StoreProvider } from 'src/StoreContext/StoreContext';
import AppErrorBoundary from 'src/AppErrorBoundary';

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
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </AppErrorBoundary>
    </NonSSRWrapper>
  );
}
