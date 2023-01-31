import { style } from '@vanilla-extract/css';

import { vars } from 'src/theme.css';

export const root = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const input = style({
  font: vars.font.scale.standard,
  border: 'none',
  padding: 4,
  // Just enough room to show blinking cursor when empty
  minWidth: 1,
});

export const sizer = style({
  visibility: 'hidden',
  position: 'absolute',
  zIndex: -1,
});
