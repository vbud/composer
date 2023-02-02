import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';

import { useStore, shallow, FileId, initialEditorWidth } from 'src/store';
import Toolbar from 'src/Toolbar/Toolbar';
import { StatusMessage } from 'src/StatusMessage/StatusMessage';
import { CodeEditor } from 'src/CodeEditor/CodeEditor';
import { Canvas } from 'src/Canvas/Canvas';
import { Text } from 'src/Text/Text';
import SnippetBrowser from 'src/SnippetBrowser/SnippetBrowser';
import { useInteractOutside } from 'src/utils/useInteractOutside';
import { formatAndInsert } from 'src/utils/formatting';
import { isValidLocation } from 'src/utils/cursor';
import { isMetaOrCtrlExclusivelyPressed } from 'src/utils/modifierKeys';

import * as styles from './File.css';

// TODO: move state into children, hooks.
function FilePage({ fileId }: { fileId: FileId }) {
  const [
    name,
    selectedFrameId,
    frames,
    editorView,
    editorWidth,
    showSnippets,
    showCanvasOnly,
    toggleShowCanvasOnly,
    toggleShowSnippets,
    updateFrameEditorState,
    updateEditorWidth,
    displayStatusMessage,
  ] = useStore(
    (s) => [
      s.files[fileId].name,
      s.files[fileId].selectedFrameId,
      s.files[fileId].frames,
      s.editorView,
      s.editorWidth,
      s.showSnippets,
      s.showCanvasOnly,
      s.toggleShowCanvasOnly,
      s.toggleShowSnippets,
      s.updateFrameEditorState,
      s.updateEditorWidth,
      s.displayStatusMessage,
    ],
    shallow
  );

  // TODO: co-locate cmd-K with Toolbar
  // TODO: use-hotkeys
  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (e.code === 'Backslash' && isMetaOrCtrlExclusivelyPressed(e)) {
        e.preventDefault();
        toggleShowCanvasOnly();
      } else if (
        e.code === 'KeyK' &&
        isMetaOrCtrlExclusivelyPressed(e) &&
        selectedFrameId !== null
      ) {
        // TODO: critical status message that snippets cannot be shown
        e.preventDefault();
        toggleShowSnippets();
      }
    };

    document.addEventListener('keydown', keyDownListener);
    return () => {
      document.removeEventListener('keydown', keyDownListener);
    };
  }, [selectedFrameId, toggleShowCanvasOnly, toggleShowSnippets]);

  const updateEditorWidthDebounced = useDebouncedCallback(updateEditorWidth, 1);

  const snippetsRef = useRef<HTMLDivElement>(null);
  useInteractOutside(snippetsRef, () => toggleShowSnippets());

  const editor = (
    <div className={styles.editorContainer}>
      {selectedFrameId !== null ? (
        <CodeEditor fileId={fileId} frameId={selectedFrameId} />
      ) : (
        <div className={styles.emptyCodeEditor}>
          <Text>No frame selected.</Text>
        </div>
      )}
    </div>
  );

  const sizeStyles = {
    height: '100%',
    width: `${editorWidth}px`,
  };

  return (
    <div className={styles.root}>
      <Head>
        <title>{name} – composer</title>
      </Head>

      {!showCanvasOnly && <Toolbar fileId={fileId} />}
      <div className={styles.main}>
        <Resizable
          className={classnames(styles.resizeableContainer, {
            [styles.resizeableContainer_isHidden]: showCanvasOnly,
          })}
          defaultSize={sizeStyles}
          size={sizeStyles}
          minWidth={initialEditorWidth}
          maxWidth="80vw"
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
          {editor}
        </Resizable>
        <Canvas fileId={fileId} />
      </div>
      {showSnippets && (
        <SnippetBrowser
          ref={snippetsRef}
          onSelectSnippet={(snippet) => {
            if (editorView && selectedFrameId !== null) {
              toggleShowSnippets();

              setTimeout(() => editorView.focus(), 0);

              const { code, cursorPosition } = frames[selectedFrameId];
              const validCursorPosition = isValidLocation({
                code,
                cursor: cursorPosition,
              });

              if (!validCursorPosition) {
                displayStatusMessage({
                  message: 'Cannot insert snippet at cursor',
                  tone: 'critical',
                });
                return;
              }

              const result = formatAndInsert({
                code,
                cursor: cursorPosition,
                snippet: snippet.code,
              });

              updateFrameEditorState(fileId, selectedFrameId, {
                code: result.code,
                cursorPosition: result.cursor,
              });
            }
          }}
        />
      )}
      <StatusMessage />
    </div>
  );
}

export default function FilePageWrapper() {
  const router = useRouter();
  const { fileId } = router.query;

  const fileFound = useStore(
    (s) => typeof fileId === 'string' && Object.keys(s.files).includes(fileId)
  );

  // Render nothing if a file does not exist for the specified fileId
  if (typeof fileId !== 'string' || fileFound === undefined) {
    // When we replace this with a "file not found" page in the future, we will
    // also need to handle the edge case of deleting a file. There is a brief
    // possible state where the file does not exist because it has been deleted,
    // and the router has not rendered the home page yet.
    return null;
  }

  return <FilePage fileId={fileId} />;
}
