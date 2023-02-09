import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../src/theme.css';

export const root = style({
  height: '100vh',
  width: '100vw',
  backgroundColor: colorPaletteVars.background.body,
  padding: 32,
  display: 'flex',
  justifyContent: 'center',
});

export const files = style({
  margin: '16px 0',
});

export const fileLink = style({
  marginTop: 8,

  selectors: {
    '&:first-child': {
      marginTop: 0,
    },
  },
});
