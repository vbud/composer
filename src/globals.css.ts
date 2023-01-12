import { globalStyle } from '@vanilla-extract/css';

export const darkModeDataAttribute = 'data-composer-dark';

globalStyle(`html[${darkModeDataAttribute}]`, {
  colorScheme: 'dark',
});

globalStyle('body', {
  margin: 0,
});

// Hide the nextjs error overlay. Runtime errors occur frequently since Frame
// code is being run as it is typed. Unfortunately, even errors handled by error
// boundaries are displayed in the error overlay, so this is the best option
// until they provide a better way of disabling the error overlay.
globalStyle('nextjs-portal', {
  display: 'none',
});
