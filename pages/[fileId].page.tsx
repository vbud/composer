import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';
import { useHotkeys } from 'react-hotkeys-hook';

import { useStore, shallow, FileId, initialEditorWidth } from 'src/store';
import Toolbar from 'src/Toolbar/Toolbar';
import { StatusMessage } from 'src/StatusMessage/StatusMessage';
import { CodeEditor } from 'src/CodeEditor/CodeEditor';
import { Canvas } from 'src/Canvas/Canvas';
import { Text } from 'src/Text/Text';
import SnippetBrowser from 'src/SnippetBrowser/SnippetBrowser';

import * as styles from './File.css';

function FilePage({ fileId }: { fileId: FileId }) {
  const [
    name,
    selectedFrameId,
    editorWidth,
    showSnippets,
    showCanvasOnly,
    toggleShowCanvasOnly,
    toggleShowSnippets,
    updateEditorWidth,
  ] = useStore(
    (s) => [
      s.files[fileId].name,
      s.files[fileId].selectedFrameId,
      s.editorWidth,
      s.showSnippets,
      s.showCanvasOnly,
      s.toggleShowCanvasOnly,
      s.toggleShowSnippets,
      s.updateEditorWidth,
    ],
    shallow
  );

  const useHotkeysOptions = {
    preventDefault: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
  };
  useHotkeys('meta+\\', () => toggleShowCanvasOnly(), useHotkeysOptions);
  useHotkeys('meta+k', () => toggleShowSnippets(), useHotkeysOptions);

  const updateEditorWidthDebounced = useDebouncedCallback(updateEditorWidth, 1);

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
          size={{
            height: '100%',
            width: `${editorWidth}px`,
          }}
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
        <Canvas fileId={fileId} />
      </div>
      {showSnippets && <SnippetBrowser fileId={fileId} />}
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
