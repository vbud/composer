import React, { useContext, useRef } from 'react';

import { snippets } from 'src/snippets';
import { useClickOutside } from 'src/utils/useClickOutside';
import { FileContext } from 'src/contexts/FileContext';
import { ToolbarItemButton, ToolbarItemLink } from './ToolbarItem';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import ZoomControlPanel from '../ZoomControlPanel/ZoomControlPanel';
import HomeIcon from '../icons/HomeIcon';
import AddSnippetIcon from '../icons/AddSnippetIcon';
import AddFrameIcon from '../icons/AddFrameIcon';
import SettingsIcon from '../icons/SettingsIcon';
import FileName from './FileName';

import * as styles from './Toolbar.css';

export default function Toolbar() {
  const [{ activeToolbarPanel, editorView, canvasPosition }, dispatch] =
    useContext(FileContext);

  const clickOutsideHandler = () => {
    dispatch({ type: 'closeToolbar' });
  };
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, clickOutsideHandler);

  const isOpen = Boolean(activeToolbarPanel);
  const isSettingsOpen = activeToolbarPanel === 'settings';
  const isZoomControlOpen = activeToolbarPanel === 'canvasZoomControl';

  const hasSnippets = snippets && snippets.length > 0;

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <ToolbarItemLink title="Home" data-testid="home" href="/">
          <HomeIcon />
        </ToolbarItemLink>
        <ToolbarItemButton
          title={`Insert snippet (${
            navigator.platform.match('Mac') ? '\u2318' : 'Ctrl + '
          }K)`}
          disabled={!editorView || !hasSnippets}
          data-testid="toggleSnippets"
          onClick={() => {
            dispatch({
              type: 'toggleSnippets',
            });
          }}
        >
          <AddSnippetIcon />
        </ToolbarItemButton>
        <ToolbarItemButton
          title="Add new frame to canvas"
          data-testid="addFrame"
          onClick={() => {
            dispatch({
              type: 'addFrame',
            });
          }}
        >
          <AddFrameIcon />
        </ToolbarItemButton>
      </div>
      <FileName />
      <div className={styles.actions}>
        <ToolbarItemButton
          title="Zoom level"
          onClick={() => {
            dispatch({
              type: 'toggleToolbar',
              payload: { panel: 'canvasZoomControl' },
            });
          }}
          data-testid="canvasZoomLevel"
        >
          {Math.round(canvasPosition.zoom * 100)}%
        </ToolbarItemButton>
        <ToolbarItemButton
          active={isSettingsOpen}
          title="Edit settings"
          onClick={() => {
            dispatch({
              type: 'toggleToolbar',
              payload: { panel: 'settings' },
            });
          }}
        >
          <SettingsIcon />
        </ToolbarItemButton>
      </div>
      {isOpen && (
        <div ref={panelRef} className={styles.panel}>
          {isSettingsOpen && <SettingsPanel />}
          {isZoomControlOpen && <ZoomControlPanel />}
        </div>
      )}
    </div>
  );
}
