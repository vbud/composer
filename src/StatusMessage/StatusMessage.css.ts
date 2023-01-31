import { calc } from '@vanilla-extract/css-utils';
import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';
import { toolbarHeight } from 'src/Toolbar/Toolbar.css';

const statusGutter = '12px';
const icon = '16px';

export const dismissable = style({});
export const show = style({});
export const positive = style({});
export const critical = style({});

export const status = style({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  borderRadius: vars.radii.large,
  padding: `8px ${statusGutter}`,
  left: '50%',
  transform: `translateX(-50%)`,
  top: toolbarHeight + 16,
  maxWidth: 300,
  selectors: {
    [`&${dismissable}`]: {
      paddingRight: calc(statusGutter).multiply(2).add(icon).toString(),
    },
    [`&${positive}`]: {
      backgroundColor: colorPaletteVars.background.positive,
    },
    [`&${critical}`]: {
      backgroundColor: colorPaletteVars.background.critical,
    },
  },
});

export const dismiss = style({
  display: 'flex',
  position: 'absolute',
  cursor: 'pointer',
  paddingLeft: statusGutter,
  right: statusGutter,
  height: icon,
  width: icon,
  selectors: {
    [`&:not(:hover)`]: {
      opacity: 0.4,
    },
  },
});
