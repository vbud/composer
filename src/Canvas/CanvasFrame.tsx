import classNames from 'classnames';
import { RefObject, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import AutosizeInput from 'src/AutosizeInput/AutosizeInput';
import {
  CanvasPosition,
  FileId,
  Frame,
  SelectedFrameId,
  shallow,
  useStore,
} from 'src/store';
import { toolbarHeight } from 'src/Toolbar/Toolbar.css';
import { components } from 'src/utils/components';
import * as styles from './CanvasFrame.css';
import { CompileAndRenderCode } from './CompileAndRenderCode';
import { NoPanArea } from './ZoomableCanvas';

interface MoveInterval {
  direction:
    | 'leftUp'
    | 'up'
    | 'rightUp'
    | 'right'
    | 'rightDown'
    | 'down'
    | 'leftDown'
    | 'left';
  interval: number;
}

const directionToDeltas: Record<MoveInterval['direction'], [number, number]> = {
  leftUp: [-1, -1],
  up: [0, -1],
  rightUp: [1, -1],
  right: [1, 0],
  rightDown: [1, 1],
  down: [0, 1],
  leftDown: [-1, 1],
  left: [-1, 0],
};

interface CanvasFrameProps {
  fileId: FileId;
  selectedFrameId: SelectedFrameId;
  frame: Frame;
  canvasPosition: CanvasPosition;
  canvasRef: RefObject<HTMLElement>;
}

export const CanvasFrame = ({
  fileId,
  selectedFrameId,
  frame,
  canvasPosition,
  canvasRef,
}: CanvasFrameProps) => {
  const { id: frameId, x, y, width, height, code } = frame;

  const [canvasViewport, editorWidth, renameFrame, moveFrame, selectFrame] =
    useStore(
      (s) => [
        s.canvasViewport,
        s.editorWidth,
        s.renameFrame,
        s.moveFrame,
        s.selectFrame,
      ],
      shallow
    );

  const dragStartPosition = useRef({ x: 0, y: 0 });
  const canvasClientRect = useRef<DOMRect | null>(null);
  const moveInterval = useRef<MoveInterval | null>(null);

  const [isNameEditable, setIsNameEditable] = useState(true);

  const moveMultiplier = 4;
  const startMoving = (direction: MoveInterval['direction']) => {
    const [x, y] = directionToDeltas[direction];
    moveInterval.current = {
      direction,
      interval: window.setInterval(
        () =>
          canvasViewport &&
          canvasViewport.camera.moveBy(x * moveMultiplier, y * moveMultiplier),
        1
      ),
    };
  };
  const stopMoving = () => {
    if (moveInterval.current) {
      clearInterval(moveInterval.current.interval);
      moveInterval.current = null;
    }
  };

  const panIfDraggingBeyondBoundary = (mouseX: number, mouseY: number) => {
    if (!canvasClientRect.current) return;

    // Determines the boundaries near the edges of the canvas where a drag should trigger canvas panning.
    const boundaryBuffer = 16;
    const { left, top, right, bottom } = canvasClientRect.current;
    const leftBoundary = left + editorWidth + boundaryBuffer;
    const topBoundary = top + toolbarHeight + boundaryBuffer;
    const rightBoundary = right - boundaryBuffer;
    const bottomBoundary = bottom - boundaryBuffer;
    let direction: MoveInterval['direction'] | undefined;

    if (mouseX < leftBoundary && mouseY < topBoundary) {
      direction = 'leftUp';
    } else if (mouseX > rightBoundary && mouseY < topBoundary) {
      direction = 'rightUp';
    } else if (mouseX > rightBoundary && mouseY > bottomBoundary) {
      direction = 'rightDown';
    } else if (mouseX < leftBoundary && mouseY > bottomBoundary) {
      direction = 'leftDown';
    } else if (mouseY < topBoundary) {
      direction = 'up';
    } else if (mouseX > rightBoundary) {
      direction = 'right';
    } else if (mouseY > bottomBoundary) {
      direction = 'down';
    } else if (mouseX < leftBoundary) {
      direction = 'left';
    }

    // if previously moving in different direction, stop previous movement
    if (direction === undefined) {
      // if mouse is dragging inside bounds, cancel any existing movement
      stopMoving();
    } else if (moveInterval.current === null) {
      // if mouse is dragging outside of bounds and we are not currently moving, start moving
      startMoving(direction);
      // if mouse is dragging outside of bounds and we are currently moving in a different direction,
      // stop moving in that direction and start moving in the new direction
    } else if (
      moveInterval.current &&
      moveInterval.current.direction !== direction
    ) {
      stopMoving();
      startMoving(direction);
    }
  };

  const isSelected = frameId === selectedFrameId;

  return (
    <NoPanArea
      style={{
        transform: `translate(${x}px,${y}px)`,
        ...(isSelected && {
          position: 'absolute',
          zIndex: 1,
        }),
      }}
    >
      <Rnd
        className={classNames(styles.root, {
          [styles.selected]: isSelected,
        })}
        // override the `cursor: move` that Rnd applies
        style={{ cursor: 'auto' }}
        size={{ width, height }}
        position={{ x: 0, y: 0 }}
        scale={canvasPosition.zoom}
        onDragStart={(_event, d) => {
          dragStartPosition.current = {
            x: d.x,
            y: d.y,
          };
          canvasRef.current &&
            (canvasClientRect.current =
              canvasRef.current.getBoundingClientRect());
        }}
        onDrag={(event) => {
          // Disable AutosizeInput while dragging so that dragging by the frame
          // name does not result in an editable frame name when the drag ends
          if (isNameEditable) setIsNameEditable(false);
          const { clientX, clientY } = event as MouseEvent;
          panIfDraggingBeyondBoundary(clientX, clientY);
        }}
        onDragStop={(_event, d) => {
          // setTimeout is required so that the click finishes before
          // AutosizeInput resumes listening for clicks
          setTimeout(() => setIsNameEditable(true), 0);
          stopMoving();
          moveFrame(fileId, frameId, {
            x: x + d.x - dragStartPosition.current.x,
            y: y + d.y - dragStartPosition.current.y,
          });
        }}
        onResizeStop={(_event, _direction, ref, _delta, position) => {
          moveFrame(fileId, frameId, {
            x: x + position.x,
            y: y + position.y,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          selectFrame(fileId, frameId);
        }}
      >
        <AutosizeInput
          className={styles.frameName}
          name="frame name"
          value={frame.name}
          onSaveValue={(value) => renameFrame(fileId, frameId, value)}
          isEditable={isNameEditable}
        />
        <div className={styles.frame}>
          <CompileAndRenderCode code={code} components={components} />
        </div>
      </Rnd>
    </NoPanArea>
  );
};
