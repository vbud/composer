import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../theme.css';

export const toolbarHeight = 40;
const toolbarBorderThickness = 1;

export const root = style({
  display: 'grid',
  // render this above the `Canvas` component
  zIndex: 1,
  width: '100%',
  height: toolbarHeight - toolbarBorderThickness,
  gridTemplateColumns: '1fr 300px 1fr',
  color: colorPaletteVars.foreground.neutral,
  backgroundColor: colorPaletteVars.background.surface,
  borderBottom: `${toolbarBorderThickness}px solid ${colorPaletteVars.border.standard}`,
});

export const actionsLeft = style({
  display: 'flex',
  alignItems: 'center',
});

export const fileName = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const actionsRight = style({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
});

export const panel = style({
  position: 'absolute',
  top: toolbarHeight,
  right: 0,
  zIndex: 1,
  display: 'flex',
  overflow: 'auto',
  pointerEvents: 'auto',
  width: 300,
  height: `calc(100vh - ${toolbarHeight}px)`,
  backgroundColor: colorPaletteVars.background.surface,
  borderBottom: `${toolbarBorderThickness}px solid ${colorPaletteVars.border.standard}`,
});
