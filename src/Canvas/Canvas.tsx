import React, { useContext, useRef } from 'react';
import { Space } from './ZoomableCanvas';
import { useDebouncedCallback } from 'use-debounce';

import {
  FileFrames,
  SelectedFrameId,
  FileContext,
} from 'src/contexts/FileContext';
import { components } from 'src/utils/components';
import { CanvasFrame } from './CanvasFrame';

import * as styles from './Canvas.css';

interface CanvasProps {
  fileFrames: FileFrames;
  selectedFrameId: SelectedFrameId;
}
export const Canvas = ({ fileFrames, selectedFrameId }: CanvasProps) => {
  const [{ canvasPosition }, dispatch] = useContext(FileContext);

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveCanvasPosition = useDebouncedCallback((vp) => {
    dispatch({
      type: 'saveCanvasPosition',
      payload: { left: vp.left, top: vp.top, zoom: vp.zoomFactor },
    });
  }, 50);

  return (
    <div
      ref={canvasRef}
      className={styles.root}
      onMouseDown={() => dispatch({ type: 'selectFrame', payload: undefined })}
    >
      <Space
        onCreate={(viewport) => {
          dispatch({
            type: 'initializeCanvas',
            payload: { canvasViewport: viewport },
          });

          const { left, top, zoom } = canvasPosition;
          viewport.camera.updateTopLeft(left, top, zoom);
        }}
        onUpdated={saveCanvasPosition}
      >
        {Object.keys(fileFrames).map((frameId) => (
          <CanvasFrame
            key={frameId}
            frameConfig={fileFrames[frameId]}
            components={components}
            selectedFrameId={selectedFrameId}
            scale={canvasPosition.zoom}
            canvasEl={canvasRef.current}
          />
        ))}
      </Space>
    </div>
  );
};
