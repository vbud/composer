import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const root = style({
  borderRadius: vars.radii.large,
  padding: `8px 12px`,
  backgroundColor: colorPaletteVars.background.critical,
  textAlign: 'center',
  maxWidth: 450,
});
