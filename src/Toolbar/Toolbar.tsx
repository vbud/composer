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
    canvasPosition,
    activeToolbarPanel,
    showSnippets,
    canvasDrawMode,
    openToolbarPanel,
    closeToolbarPanel,
    toggleShowSnippets,
    setCanvasDrawMode,
  ] = useStore(
    (s) => [
      s.files[fileId].canvasPosition,
      s.activeToolbarPanel,
      s.showSnippets,
      s.canvasDrawMode,
      s.openToolbarPanel,
      s.closeToolbarPanel,
      s.toggleShowSnippets,
      s.setCanvasDrawMode,
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
            navigator.platform.match('Mac') ? '\u2318' : '\u2303'
          }K)`}
          data-testid="toggleSnippets"
          active={showSnippets}
          onClick={() => {
            toggleShowSnippets();
          }}
        >
          <AddSnippetIcon />
        </ToolbarItemButton>
        <ToolbarItemButton
          title="Add new frame to canvas (F)"
          data-testid="addFrame"
          active={canvasDrawMode === 'frame'}
          onClick={() => setCanvasDrawMode('frame')}
        >
          <AddFrameIcon />
        </ToolbarItemButton>
      </div>
      <FileName fileId={fileId} />
      <div className={styles.actionsRight}>
        <ToolbarItemButton
          title="Zoom level"
          data-testid="canvasZoomLevel"
          active={isZoomControlOpen}
          onClick={() => openToolbarPanel('canvasZoomControl')}
        >
          {Math.round(canvasPosition.zoom * 100)}%
        </ToolbarItemButton>
        <ToolbarItemButton
          title="Edit settings"
          active={isSettingsOpen}
          onClick={() => openToolbarPanel('settings')}
        >
          <SettingsIcon />
        </ToolbarItemButton>
      </div>
      {isOpen && (
        <div ref={panelRef} className={styles.panel}>
          {isZoomControlOpen && <ZoomControlPanel />}
          {isSettingsOpen && <SettingsPanel fileId={fileId} />}
        </div>
      )}
    </div>
  );
}
