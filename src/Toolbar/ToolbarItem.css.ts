import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const disabled = style({});
export const active = style({});

export const root = style({
  border: 0,
  padding: `0 ${vars.space.large}`,
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  color: 'currentColor',
  backgroundColor: colorPaletteVars.background.surface,

  selectors: {
    [`&:not(${disabled})`]: {
      cursor: 'pointer',
    },

    [`&${disabled}`]: {
      color: colorPaletteVars.foreground.neutralSoft,
    },

    [`&${active}:not(${disabled})`]: {
      background: colorPaletteVars.background.accent,
    },

    [`&:not(${active}):not(${disabled}):hover`]: {
      backgroundColor: colorPaletteVars.background.selection,
    },
  },
});
