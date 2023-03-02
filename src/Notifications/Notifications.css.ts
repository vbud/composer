import { style } from '@vanilla-extract/css';
import { toolbarHeight } from 'src/Toolbar/Toolbar.css';

const distanceFromEdge = 16;

export const toolbarHidden = style({});
export const root = style({
  position: 'absolute',
  zIndex: 1,
  left: '50%',
  transform: `translateX(-50%)`,
  top: toolbarHeight + distanceFromEdge,
  selectors: {
    [`&${toolbarHidden}`]: {
      top: distanceFromEdge,
    },
  },
});
