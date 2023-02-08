import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from 'src/theme.css';

export const root = style({
  textDecoration: `underline ${colorPaletteVars.foreground.accentSoft}`,
  color: colorPaletteVars.foreground.accent,
  ':hover': {
    textDecorationColor: 'inherit',
  },
});
