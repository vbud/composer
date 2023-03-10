import classnames from 'classnames';
import { Resizable } from 're-resizable';
import { FileId, SelectedFrameId, shallow, useStore } from 'src/store';
import { Text } from 'src/Text/Text';
import { useDebouncedCallback } from 'use-debounce';
import { CodeEditor } from './CodeEditor';
import * as styles from './ResizableCodeEditor.css';

export const editorWidths = { min: 200, max: 840, default: 400 };

export const ResizableCodeEditor = ({
  fileId,
  selectedFrameId,
}: {
  fileId: FileId;
  selectedFrameId: SelectedFrameId;
}) => {
  const [editorWidth, showCanvasOnly, updateEditorWidth] = useStore(
    (s) => [s.editorWidth, s.showCanvasOnly, s.updateEditorWidth],
    shallow
  );

  const updateEditorWidthDebounced = useDebouncedCallback(updateEditorWidth, 1);

  return (
    <div
      className={classnames(styles.root, {
        [styles.root_isHidden]: showCanvasOnly,
      })}
    >
      <Resizable
        size={{
          width: `${editorWidth}px`,
          height: '100%',
        }}
        minWidth={editorWidths.min}
        maxWidth={editorWidths.max}
        onResize={(_event, _direction, { offsetWidth }) => {
          updateEditorWidthDebounced(offsetWidth);
        }}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div className={styles.editorContainer}>
          {selectedFrameId !== null ? (
            <CodeEditor fileId={fileId} frameId={selectedFrameId} />
          ) : (
            <div className={styles.emptyCodeEditor}>
              <Text>No frame selected.</Text>
            </div>
          )}
        </div>
      </Resizable>
    </div>
  );
};
