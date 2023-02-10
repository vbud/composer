import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import 'parse-prop-types';
import { ReactElement } from 'react';
import AppErrorBoundary from 'src/AppErrorBoundary';
import 'src/globals.css';
import { useColorScheme } from 'src/utils/colorScheme';

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

// ts-unused-exports:disable-next-line
export default function App({ Component, pageProps }: AppProps) {
  return (
    <NonSSRWrapper>
      <Component {...pageProps} />
    </NonSSRWrapper>
  );
}
