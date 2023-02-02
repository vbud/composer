import React, { useRef } from 'react';

import { useStore, shallow, FileId } from 'src/store';
import { useInteractOutside } from 'src/utils/useInteractOutside';
import { ToolbarItemButton, ToolbarItemLink } from './ToolbarItem';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import ZoomControlPanel from '../ZoomControlPanel/ZoomControlPanel';
import HomeIcon from '../icons/HomeIcon';
import AddSnippetIcon from '../icons/AddSnippetIcon';
import AddFrameIcon from '../icons/AddFrameIcon';
import SettingsIcon from '../icons/SettingsIcon';
import FileName from './FileName';

import * as styles from './Toolbar.css';

export default function Toolbar({ fileId }: { fileId: FileId }) {
  const [
    activeToolbarPanel,
    canvasPosition,
    openToolbarPanel,
    closeToolbarPanel,
    toggleShowSnippets,
    createFrame,
  ] = useStore(
    (s) => [
      s.activeToolbarPanel,
      s.files[fileId].canvasPosition,
      s.openToolbarPanel,
      s.closeToolbarPanel,
      s.toggleShowSnippets,
      s.createFrame,
    ],
    shallow
  );

  const panelRef = useRef<HTMLDivElement>(null);
  useInteractOutside(panelRef, () => closeToolbarPanel());

  const isOpen = Boolean(activeToolbarPanel);
  const isSettingsOpen = activeToolbarPanel === 'settings';
  const isZoomControlOpen = activeToolbarPanel === 'canvasZoomControl';

  return (
    <div className={styles.root}>
      <div className={styles.actionsLeft}>
        <ToolbarItemLink title="Home" data-testid="home" href="/">
          <HomeIcon />
        </ToolbarItemLink>
        <ToolbarItemButton
          title={`Insert snippet (${
            navigator.platform.match('Mac') ? '\u2318' : 'Ctrl + '
          }K)`}
          data-testid="toggleSnippets"
          onClick={() => {
            toggleShowSnippets();
          }}
        >
          <AddSnippetIcon />
        </ToolbarItemButton>
        <ToolbarItemButton
          title="Add new frame to canvas"
          data-testid="addFrame"
          onClick={() => {
            createFrame(fileId);
          }}
        >
          <AddFrameIcon />
        </ToolbarItemButton>
      </div>
      <FileName fileId={fileId} />
      <div className={styles.actionsRight}>
        <ToolbarItemButton
          title="Zoom level"
          onClick={() => {
            openToolbarPanel('canvasZoomControl');
          }}
          data-testid="canvasZoomLevel"
        >
          {Math.round(canvasPosition.zoom * 100)}%
        </ToolbarItemButton>
        <ToolbarItemButton
          active={isSettingsOpen}
          title="Edit settings"
          onClick={() => {
            openToolbarPanel('settings');
          }}
        >
          <SettingsIcon />
        </ToolbarItemButton>
      </div>
      {isOpen && (
        <div ref={panelRef} className={styles.panel}>
          {isSettingsOpen && <SettingsPanel fileId={fileId} />}
          {isZoomControlOpen && <ZoomControlPanel />}
        </div>
      )}
    </div>
  );
}
