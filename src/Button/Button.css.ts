import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { colorPaletteVars, vars } from '../theme.css';

export const reset = style({
  border: 0,
  margin: 0,
  padding: 0,
  appearance: 'none',
  userSelect: 'none',
  position: 'relative',
  cursor: 'pointer',
  display: 'flex',
  placeItems: 'center',
  background: 'transparent',
  outline: 'none',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const highlightColor = createVar();

export const root = style({
  vars: {
    [highlightColor]: 'currentColor',
  },
  padding: `0 ${vars.space.large}`,
  font: vars.font.scale.standard,
  borderRadius: vars.radii.large,
  color: highlightColor,
  border: `1px solid ${colorPaletteVars.foreground.neutralSoft}`,
  height: calc(vars.grid).multiply(9).toString(),
  ':hover': {
    vars: {
      [highlightColor]: colorPaletteVars.foreground.accent,
    },
    borderColor: highlightColor,
  },
  selectors: {
    [`&:focus:not(:active):not(:hover):not([disabled])`]: {
      boxShadow: colorPaletteVars.shadows.focus,
    },
  },
});

export const critical = style({
  vars: {
    [highlightColor]: `${colorPaletteVars.foreground.critical} !important`,
  },
  borderColor: highlightColor,
});

export const iconContainer = style({
  position: 'relative',
  paddingLeft: vars.space.medium,
  top: 1,
});

export const buttonLink = style({
  display: 'inline',
  textDecoration: `underline ${colorPaletteVars.foreground.accentSoft}`,
  color: colorPaletteVars.foreground.accent,
  ':hover': {
    textDecorationColor: 'inherit',
  },
});
