import React, { useCallback, useEffect } from 'react';
import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
  EditorView,
  ViewUpdate,
} from '@codemirror/view';
import { EditorState, TransactionSpec } from '@codemirror/state';
import {
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { Diagnostic, linter, lintKeymap } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';
import { debounce } from 'lodash';

import { useStore, shallow, FileId, FrameId } from 'src/store';
import { formatCode } from 'src/utils/formatting';
import { compileJsx } from 'src/utils/compileJsx';
import { cursorCoordinatesToCursorPosition } from 'src/utils/cursor';
import { getCompletions } from './completions';
import { hints } from 'src/utils/components';
import { highlightStyle, themeExtension } from './styles';

import * as styles from './CodeEditor.css';

const errorLinter = linter((view) => {
  const diagnostics: Diagnostic[] = [];
  const code = view.state.doc.toString();

  try {
    compileJsx(code);
  } catch (err) {
    let errorMessage = '';
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    const matches = errorMessage.match(/\(([0-9]+):([0-9]+)\)/);
    let line, col;
    if (matches && matches.length === 3) {
      line = parseInt(matches[1], 10);
      col = parseInt(matches[2], 10);
    }

    if (line !== undefined && line >= 0 && col !== undefined && col >= 0) {
      const cursor = cursorCoordinatesToCursorPosition(code, {
        line: line - 1,
        col,
      });
      diagnostics.push({
        from: cursor,
        to: cursor + 1,
        severity: 'error',
        message: errorMessage,
      });
    }
  }

  return diagnostics;
});

export const CodeEditor = ({
  fileId,
  frameId,
}: {
  fileId: FileId;
  frameId: FrameId;
}) => {
  const [
    editorView,
    frame,
    updateFrameEditorState,
    initializeEditor,
    destroyEditor,
  ] = useStore(
    (s) => [
      s.editorView,
      s.files[fileId].frames[frameId],
      s.updateFrameEditorState,
      s.initializeEditor,
      s.destroyEditor,
    ],
    shallow
  );

  const { code, cursorPosition } = frame;

  editorView?.dispatch({});
  useEffect(() => {
    if (!editorView) return;

    const transaction: TransactionSpec = {};

    const { code: stateCode, cursorPosition: stateCursorPosition } = frame;
    const editorCode = editorView.state.doc.toString();
    if (stateCode !== editorCode) {
      transaction.changes = {
        from: 0,
        to: editorCode.length,
        insert: stateCode,
      };
    }

    const editorCursorPosition = editorView.state.selection.main.anchor;
    if (stateCursorPosition !== editorCursorPosition) {
      transaction.selection = { anchor: stateCursorPosition };
    }

    if (Object.keys(transaction).length > 0) {
      editorView.dispatch(transaction);
    }
  }, [editorView, frame]);

  const setupEditor = useCallback(
    (node: HTMLDivElement | null) => {
      console.log('setupEditor', node);
      if (node) {
        const updateFrameEditorStateDebounced = debounce(
          updateFrameEditorState,
          250
        );

        const updateListener = EditorView.updateListener.of(
          (viewUpdate: ViewUpdate) => {
            if (viewUpdate.docChanged || viewUpdate.selectionSet) {
              updateFrameEditorStateDebounced(fileId, frameId, {
                code: viewUpdate.state.doc.toString(),
                cursorPosition: viewUpdate.state.selection.main.anchor,
              });
            }
          }
        );

        const extensions = [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion({
            override: getCompletions(hints),
            icons: false,
          }),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          javascript({ jsx: true }),
          themeExtension,
          syntaxHighlighting(highlightStyle),
          errorLinter,
          updateListener,
          keymap.of([
            ...defaultKeymap,
            ...closeBracketsKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...lintKeymap,
            {
              key: 'Mod-s',
              run: (view: EditorView) => {
                const currentCode = view.state.doc.toString();
                const result = formatCode({
                  code: currentCode,
                  cursor: view.state.selection.main.anchor,
                });
                view.dispatch({
                  changes: {
                    from: 0,
                    to: currentCode.length,
                    insert: result.code,
                  },
                  selection: { anchor: result.cursor },
                });
                return true;
              },
            },
          ]),
        ];

        const initialState = EditorState.create({
          extensions,
          doc: code,
          selection: {
            anchor: cursorPosition,
          },
        });

        initializeEditor(
          new EditorView({
            state: initialState,
            parent: node,
          })
        );
      } else {
        // cleanup
        destroyEditor();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileId, frameId]
    // Tear down and re-setup the editor whenever `fileId` or `frameId` changes
    // so that `updateListener` is registered with the latest `fileId` and
    // `frameId`. However, we explicitly ignore the other state this
    // `useCallback` depends on, as they are only used for the `EditorView`
    // `initialState`. We would not want to tear down and re-setup the editor
    // whenever `code` or `cursorPosition` changes.
  );

  return <div className={styles.root} ref={setupEditor} />;
};
