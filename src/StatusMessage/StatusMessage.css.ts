import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

const statusGutter = 12;

export const positive = style({});
export const critical = style({});

export const root = style({
  display: 'flex',
  borderRadius: vars.radii.large,
  padding: `8px ${statusGutter}px`,
  maxWidth: 400,
  selectors: {
    [`&${positive}`]: {
      backgroundColor: colorPaletteVars.background.positive,
    },
    [`&${critical}`]: {
      backgroundColor: colorPaletteVars.background.critical,
    },
  },
});

export const message = style({
  textAlign: 'center',
});

export const dismiss = style({
  cursor: 'pointer',
  paddingLeft: statusGutter,
  selectors: {
    [`&:not(:hover)`]: {
      opacity: 0.4,
    },
  },
});
