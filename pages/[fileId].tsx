import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';

import { FileContextProvider } from 'src/contexts/FileContext';
import Toolbar from 'src/Toolbar/Toolbar';
import { StatusMessage } from 'src/StatusMessage/StatusMessage';
import { initialEditorWidth, AppContext } from 'src/contexts/AppContext';
import { FileContext } from 'src/contexts/FileContext';
import { CodeEditor } from 'src/CodeEditor/CodeEditor';
import { Canvas } from 'src/Canvas/Canvas';
import { Text } from 'src/Text/Text';
import SnippetBrowser from 'src/SnippetBrowser/SnippetBrowser';
import { useClickOutside } from 'src/utils/useClickOutside';
import { formatAndInsert } from 'src/utils/formatting';
import { isValidLocation } from 'src/utils/cursor';
import { isMetaOrCtrlExclusivelyPressed } from 'src/utils/modifierKeys';

import * as styles from '../pageStyles/File.css';

function File() {
  const [
    { editorView, showSnippets, showCanvasOnly, selectedFrameId, fileFrames },
    fileDispatch,
  ] = useContext(FileContext);
  const [{ editorWidth }, appDispatch] = useContext(AppContext);

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (e.code === 'Backslash' && isMetaOrCtrlExclusivelyPressed(e)) {
        e.preventDefault();
        fileDispatch({ type: 'toggleShowCanvasOnly' });
      } else if (e.code === 'KeyK' && isMetaOrCtrlExclusivelyPressed(e)) {
        e.preventDefault();
        fileDispatch({
          type: 'toggleSnippets',
        });
      }
    };

    document.addEventListener('keydown', keyDownListener);
    return () => {
      document.removeEventListener('keydown', keyDownListener);
    };
  }, [fileDispatch, showCanvasOnly]);

  const updateEditorWidth = useDebouncedCallback((width: number) => {
    appDispatch({
      type: 'updateEditorWidth',
      payload: width,
    });
  }, 1);

  const clickOutsideHandler = () => {
    fileDispatch({ type: 'toggleSnippets' });
  };
  const snippetsRef = useRef<HTMLDivElement>(null);
  useClickOutside(snippetsRef, clickOutsideHandler);

  const editor = (
    <div className={styles.editorContainer}>
      {selectedFrameId ? (
        <CodeEditor frameId={selectedFrameId} />
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
        <title>composer</title>
        <meta name="description" content="Design + engineering = ❤️" />
      </Head>

      {!showCanvasOnly && <Toolbar />}
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
            updateEditorWidth(offsetWidth);
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
        <Canvas fileFrames={fileFrames} selectedFrameId={selectedFrameId} />
      </div>
      {showSnippets && (
        <SnippetBrowser
          ref={snippetsRef}
          onSelectSnippet={(snippet) => {
            if (editorView && selectedFrameId !== null) {
              fileDispatch({ type: 'toggleSnippets' });

              setTimeout(() => editorView.focus(), 0);

              const { code, cursorPosition } = fileFrames[selectedFrameId];
              const validCursorPosition = isValidLocation({
                code,
                cursor: cursorPosition,
              });

              if (!validCursorPosition) {
                fileDispatch({
                  type: 'displayStatusMessage',
                  payload: {
                    message: 'Cannot insert snippet at cursor',
                    tone: 'critical',
                  },
                });
                return;
              }

              const result = formatAndInsert({
                code,
                cursor: cursorPosition,
                snippet: snippet.code,
              });

              fileDispatch({
                type: 'updateEditorState',
                payload: {
                  code: result.code,
                  cursorPosition: result.cursor,
                },
              });
            }
          }}
        />
      )}
      <StatusMessage />
    </div>
  );
}

export default function FileContainer() {
  const router = useRouter();
  const { fileId } = router.query;

  return (
    typeof fileId === 'string' && (
      <FileContextProvider fileId={fileId}>
        <File />
      </FileContextProvider>
    )
  );
}
