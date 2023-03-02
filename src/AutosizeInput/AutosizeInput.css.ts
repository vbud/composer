import { style } from '@vanilla-extract/css';
import { vars } from 'src/theme.css';

export const root = style({
  cursor: 'default',
});

export const input = style({
  font: vars.font.scale.standard,
  border: 'none',
  // override default box-sizing so that padding adds to the width
  boxSizing: 'content-box',
  padding: '2px 4px',
  // just enough room to show blinking cursor when empty
  minWidth: 1,
});

export const sizer = style({
  visibility: 'hidden',
  position: 'absolute',
  zIndex: -1,
});
