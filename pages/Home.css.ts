import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../src/theme.css';

export const root = style({
  height: '100vh',
  width: '100vw',
  backgroundColor: colorPaletteVars.background.body,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 200px)',
  columnGap: 16,
  justifyContent: 'center',
  padding: 32,
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
