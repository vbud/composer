import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from 'src/theme.css';

export const selected = style({});
export const root = style({
  position: 'relative',
  outline: 'none',
  selectors: {
    [`&${selected}`]: {
      boxShadow: `0 0 0 4px ${colorPaletteVars.foreground.accent}`,
    },
  },
});

export const frameName = style({
  position: 'absolute',
  width: '100%',
  transform: 'translateY(-100%)',
  padding: '4px 0',
  selectors: {
    [`${selected} &`]: {
      color: colorPaletteVars.foreground.accent,
    },
  },
});

export const frame = style({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  background: 'white',
  color: 'black',
});
