import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useHotkeys } from 'react-hotkeys-hook';

import { useStore, shallow, FileId } from 'src/store';
import Toolbar from 'src/Toolbar/Toolbar';
import { StatusMessage } from 'src/StatusMessage/StatusMessage';
import { Canvas } from 'src/Canvas/Canvas';
import SnippetBrowser from 'src/SnippetBrowser/SnippetBrowser';

import * as styles from './File.css';
import { ResizableCodeEditor } from 'src/CodeEditor/ResizableCodeEditor';

function FilePage({ fileId }: { fileId: FileId }) {
  const [
    name,
    selectedFrameId,
    showSnippets,
    showCanvasOnly,
    editorView,
    toggleShowCanvasOnly,
    toggleShowSnippets,
  ] = useStore(
    (s) => [
      s.files[fileId].name,
      s.files[fileId].selectedFrameId,
      s.showSnippets,
      s.showCanvasOnly,
      s.editorView,
      s.toggleShowCanvasOnly,
      s.toggleShowSnippets,
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
  useHotkeys('meta+e', () => editorView?.focus(), useHotkeysOptions, [
    editorView,
  ]);

  return (
    <div className={styles.root}>
      <Head>
        <title>{name} – composer</title>
      </Head>

      {!showCanvasOnly && <Toolbar fileId={fileId} />}
      <div className={styles.main}>
        <ResizableCodeEditor
          fileId={fileId}
          selectedFrameId={selectedFrameId}
        />
        <Canvas fileId={fileId} />
      </div>
      {showSnippets && <SnippetBrowser fileId={fileId} />}
      <StatusMessage />
    </div>
  );
}

// ts-unused-exports:disable-next-line
export default function FilePageWrapper() {
  const router = useRouter();
  const { fileId } = router.query;

  const fileFound: boolean = useStore(
    (s) => typeof fileId === 'string' && Object.keys(s.files).includes(fileId)
  );
  const resetFileUIState = useStore((s) => s.resetFileUIState);

  useEffect(() => {
    const handleRouteChange = () => {
      resetFileUIState();
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render nothing if a file does not exist for the specified fileId
  if (typeof fileId !== 'string' || !fileFound) {
    // When we replace this with a "file not found" page in the future, we will
    // also need to handle the edge case of deleting a file. There is a brief
    // possible state where the file does not exist because it has been deleted,
    // and the router has not rendered the home page yet.
    return null;
  }

  return <FilePage fileId={fileId} />;
}
