import { style } from '@vanilla-extract/css';

export const root = style({
  flexGrow: 1,
  position: 'relative',
  outline: 'none',
});

export const drawFrameMode = style({
  cursor: 'crosshair',
});
