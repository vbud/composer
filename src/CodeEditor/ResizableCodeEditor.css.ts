import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from 'src/theme.css';
import { toolbarHeight } from 'src/Toolbar/Toolbar.css';

export const root_isHidden = style({});

export const root = style({
  display: 'inline-block',
  position: 'relative',
  zIndex: 1,
  height: `calc(100vh - ${toolbarHeight}px)`,
  selectors: {
    [`&${root_isHidden}`]: {
      display: 'none',
    },
  },
});

export const editorContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  backgroundColor: colorPaletteVars.background.surface,
  borderRight: `1px solid ${colorPaletteVars.border.standard}`,
});

export const emptyCodeEditor = style({
  flexGrow: 1,
  textAlign: 'center',
  padding: vars.space.large,
});
