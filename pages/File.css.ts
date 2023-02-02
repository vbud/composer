import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from 'src/theme.css';

export const root = style({
  height: '100vh',
  width: '100vw',
  backgroundColor: colorPaletteVars.background.body,
  display: 'flex',
  flexDirection: 'column',
});

export const main = style({
  flexGrow: 1,
  overflow: 'hidden',
  display: 'flex',
});
