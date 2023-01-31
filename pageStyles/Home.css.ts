import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../src/theme.css';

export const root = style({
  height: '100vh',
  width: '100vw',
  backgroundColor: colorPaletteVars.background.body,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 16,
});

export const files = style({
  margin: '16px 0',
});

export const fileLink = style({
  marginTop: 16,

  selectors: {
    '&:first-child': {
      marginTop: 0,
    },
  },
});
