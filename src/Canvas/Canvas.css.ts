import { style } from '@vanilla-extract/css';

export const root = style({
  // necessary because the `tabIndex` attribute is set
  outline: 'none',
});

export const drawFrameMode = style({
  cursor: 'crosshair',
});
