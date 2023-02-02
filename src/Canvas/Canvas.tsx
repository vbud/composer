import React, { useRef } from 'react';
import { Space } from './ZoomableCanvas';
import { useDebouncedCallback } from 'use-debounce';

import { useStore, shallow, FileId } from 'src/store';
import { CanvasFrame } from './CanvasFrame';

import * as styles from './Canvas.css';

export const Canvas = ({ fileId }: { fileId: FileId }) => {
  const [
    canvasPosition,
    frames,
    selectedFrameId,
    saveCanvasPosition,
    selectFrame,
    initializeCanvas,
    destroyCanvas,
  ] = useStore(
    (s) => [
      s.files[fileId].canvasPosition,
      s.files[fileId].frames,
      s.files[fileId].selectedFrameId,
      s.saveCanvasPosition,
      s.selectFrame,
      s.initializeCanvas,
      s.destroyCanvas,
    ],
    shallow
  );

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveCanvasPositionDebounced = useDebouncedCallback((vp) => {
    saveCanvasPosition(fileId, {
      left: vp.left,
      top: vp.top,
      zoom: vp.zoomFactor,
    });
  }, 50);

  return (
    <div
      ref={canvasRef}
      className={styles.root}
      onMouseDown={() => selectFrame(fileId, null)}
    >
      <Space
        onCreate={(viewport) => {
          initializeCanvas(viewport);

          const { left, top, zoom } = canvasPosition;
          viewport.camera.updateTopLeft(left, top, zoom);
        }}
        onUpdated={saveCanvasPositionDebounced}
        onDestroy={destroyCanvas}
      >
        {Object.keys(frames).map((frameId) => (
          <CanvasFrame
            key={frameId}
            fileId={fileId}
            selectedFrameId={selectedFrameId}
            frame={frames[frameId]}
            canvasPosition={canvasPosition}
            canvasEl={canvasRef.current}
          />
        ))}
      </Space>
    </div>
  );
};
