import React from 'react';
import { Space, PressEventCoordinates } from './ZoomableCanvas';
import { useDebouncedCallback } from 'use-debounce';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames';

import { useStore, shallow, FileId } from 'src/store';
import { CanvasFrame } from './CanvasFrame';
import { useInteractOutside } from 'src/utils/useInteractOutside';

import * as styles from './Canvas.css';

export const Canvas = ({ fileId }: { fileId: FileId }) => {
  const [
    canvasPosition,
    frames,
    selectedFrameId,
    canvasViewport,
    canvasDrawMode,
    saveCanvasPosition,
    createFrame,
    deleteFrame,
    selectFrame,
    initializeCanvas,
    destroyCanvas,
    setCanvasDrawMode,
  ] = useStore(
    (s) => [
      s.files[fileId].canvasPosition,
      s.files[fileId].frames,
      s.files[fileId].selectedFrameId,
      s.canvasViewport,
      s.canvasDrawMode,
      s.saveCanvasPosition,
      s.createFrame,
      s.deleteFrame,
      s.selectFrame,
      s.initializeCanvas,
      s.destroyCanvas,
      s.setCanvasDrawMode,
    ],
    shallow
  );

  const canvasRef = React.useRef<HTMLDivElement | null>(null);
  useHotkeys<HTMLDivElement>(
    'backspace',
    (e) => {
      if (e.target instanceof Node && canvasRef.current?.contains(e.target)) {
        selectedFrameId !== null && deleteFrame(fileId, selectedFrameId);
      }
    },
    undefined,
    [selectedFrameId]
  );
  useInteractOutside(canvasRef, () => setCanvasDrawMode(null));

  const saveCanvasPositionDebounced = useDebouncedCallback((vp) => {
    saveCanvasPosition(fileId, {
      left: vp.left,
      top: vp.top,
      zoom: vp.zoomFactor,
    });
  }, 50);

  const addFrame = ({ clientX, clientY }: PressEventCoordinates) => {
    canvasViewport &&
      createFrame(
        fileId,
        canvasViewport.translateClientXYCoordinatesToVirtualSpace(
          clientX,
          clientY
        )
      );
    setCanvasDrawMode(null);
  };

  return (
    <Space
      className={classNames(styles.root, {
        [styles.drawFrameMode]: canvasDrawMode === 'frame',
      })}
      onCreate={(viewport, node) => {
        initializeCanvas(viewport);
        canvasRef.current = node;

        const { left, top, zoom } = canvasPosition;
        viewport.camera.updateTopLeft(left, top, zoom);
      }}
      onUpdated={saveCanvasPositionDebounced}
      onDestroy={destroyCanvas}
      onPressOutsideInteractable={() => {
        return {
          onTap: (coordinates) => {
            if (canvasDrawMode === 'frame') {
              addFrame(coordinates);
            } else {
              selectFrame(fileId, null);
            }
          },
        };
      }}
      tabIndex={-1}
    >
      {Object.keys(frames).map((frameId) => (
        <CanvasFrame
          key={frameId}
          fileId={fileId}
          selectedFrameId={selectedFrameId}
          frame={frames[frameId]}
          canvasPosition={canvasPosition}
          canvasRef={canvasRef}
        />
      ))}
    </Space>
  );
};
