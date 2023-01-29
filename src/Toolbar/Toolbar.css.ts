import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../theme.css';

export const toolbarHeight = 40;
const toolbarBorderThickness = 1;

export const root = style({
  width: '100%',
  height: toolbarHeight - toolbarBorderThickness,
  display: 'flex',
  alignItems: 'center',
  color: colorPaletteVars.foreground.neutral,
  backgroundColor: colorPaletteVars.background.surface,
  borderBottom: `${toolbarBorderThickness}px solid ${colorPaletteVars.border.standard}`,
});

export const alignNextItemsRight = style({
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
