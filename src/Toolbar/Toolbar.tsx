import { useRef } from 'react';
import { FileId, shallow, useStore } from 'src/store';
import { Text } from 'src/Text/Text';
import { useInteractOutside } from 'src/utils/useInteractOutside';
import AutosizeInput from '../AutosizeInput/AutosizeInput';
import AddFrameIcon from '../icons/AddFrameIcon';
import AddSnippetIcon from '../icons/AddSnippetIcon';
import HomeIcon from '../icons/HomeIcon';
import SettingsIcon from '../icons/SettingsIcon';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import ZoomControlPanel from '../ZoomControlPanel/ZoomControlPanel';
import * as styles from './Toolbar.css';
import { ToolbarItemButton, ToolbarItemLink } from './ToolbarItem';

export default function Toolbar({ fileId }: { fileId: FileId }) {
  const [
    filename,
    canvasPosition,
    activeToolbarPanel,
    showSnippets,
    canvasDrawMode,
    renameFile,
    openToolbarPanel,
    closeToolbarPanel,
    toggleShowSnippets,
    setCanvasDrawMode,
  ] = useStore(
    (s) => [
      s.files[fileId].name,
      s.files[fileId].canvasPosition,
      s.activeToolbarPanel,
      s.showSnippets,
      s.canvasDrawMode,
      s.renameFile,
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
      <AutosizeInput
        className={styles.fileName}
        name="file name"
        value={filename}
        onSaveValue={(value) => renameFile(fileId, value)}
      />
      <div className={styles.actionsRight}>
        <ToolbarItemButton
          title="Zoom level"
          data-testid="canvasZoomLevel"
          active={isZoomControlOpen}
          onClick={() => openToolbarPanel('canvasZoomControl')}
        >
          <Text>{Math.round(canvasPosition.zoom * 100)}%</Text>
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
