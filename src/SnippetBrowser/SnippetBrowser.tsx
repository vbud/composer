import classnames from 'classnames';
import Fuse from 'fuse.js';
import { useMemo, useRef, useState } from 'react';
import { Snippet, snippets } from 'src/snippets';
import { FileId, shallow, useStore } from 'src/store';
import { compileJsx } from 'src/utils/compileJsx';
import { components } from 'src/utils/components';
import { isValidLocation } from 'src/utils/cursor';
import { formatAndInsert } from 'src/utils/formatting';
import { useInteractOutside } from 'src/utils/useInteractOutside';
import { useDebouncedCallback } from 'use-debounce';
import RenderCode from '../RenderCode/RenderCode';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';
import SearchField from './SearchField/SearchField';
import * as styles from './SnippetBrowser.css';

type HighlightIndex = number | null;

const snippetsSearcher = new Fuse(snippets, {
  keys: [
    { name: 'componentName', weight: 2 },
    { name: 'name', weight: 1 },
  ],
  ignoreLocation: true,
  threshold: 0.5,
});

const filterSnippetsForTerm = (term: string): Snippet[] =>
  term ? snippetsSearcher.search(term).map(({ item }) => item) : snippets;

const scrollToHighlightedSnippet = (
  listEl: HTMLUListElement | null,
  highlightedEl: HTMLLIElement | null
) => {
  if (highlightedEl && listEl) {
    const scrollStep = Math.max(
      Math.ceil(listEl.offsetHeight * 0.25),
      highlightedEl.offsetHeight * 2
    );
    const currentListTop = listEl.scrollTop + scrollStep;
    const currentListBottom =
      listEl.offsetHeight + listEl.scrollTop - scrollStep;
    let top = 0;

    if (
      highlightedEl === listEl.firstChild ||
      highlightedEl === listEl.lastChild
    ) {
      highlightedEl.scrollIntoView(false);
      return;
    }

    if (highlightedEl.offsetTop >= currentListBottom) {
      top =
        highlightedEl.offsetTop -
        listEl.offsetHeight +
        highlightedEl.offsetHeight +
        scrollStep;
    } else if (highlightedEl.offsetTop <= currentListTop) {
      top = highlightedEl.offsetTop - scrollStep;
    } else {
      return;
    }

    if ('scrollBehavior' in window.document.documentElement.style) {
      listEl.scrollTo({
        left: 0,
        top,
        behavior: 'smooth',
      });
    } else {
      listEl.scrollTo(0, top);
    }
  }
};

export default function SnippetBrowser({ fileId }: { fileId: FileId }) {
  const [
    selectedFrameId,
    frames,
    editorView,
    toggleShowSnippets,
    updateFrameEditorState,
    displayStatusMessage,
  ] = useStore(
    (s) => [
      s.files[fileId].selectedFrameId,
      s.files[fileId].frames,
      s.editorView,
      s.toggleShowSnippets,
      s.updateFrameEditorState,
      s.displayStatusMessage,
    ],
    shallow
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] =
    useState<HighlightIndex>(null);

  const listEl = useRef<HTMLUListElement | null>(null);
  const highlightedEl = useRef<HTMLLIElement | null>(null);

  const debounceScrollToHighlighted = useDebouncedCallback(
    scrollToHighlightedSnippet,
    50
  );
  const filteredSnippets = useMemo(
    () => filterSnippetsForTerm(searchTerm),
    [searchTerm]
  );

  const rootRef = useRef<HTMLDivElement>(null);
  useInteractOutside(rootRef, () => toggleShowSnippets());

  const onSelectSnippet = (snippet: Snippet) => {
    toggleShowSnippets();

    if (selectedFrameId === null) {
      displayStatusMessage({
        message: 'Select a frame before trying to insert a snippet',
        tone: 'critical',
      });
      return;
    }

    if (editorView) {
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
  };

  return (
    <div ref={rootRef} className={styles.root} data-testid="snippets">
      <div className={styles.fieldContainer}>
        <SearchField
          value={searchTerm}
          onChange={(e) => {
            const { value } = e.currentTarget;
            setSearchTerm(value);
          }}
          placeholder="Find a snippet..."
          onBlur={() => {
            setHighlightedIndex(null);
          }}
          onKeyUp={() => {
            debounceScrollToHighlighted(listEl.current, highlightedEl.current);
          }}
          onKeyDown={(event) => {
            if (/^(?:Arrow)?Down$/.test(event.key)) {
              if (
                highlightedIndex === null ||
                highlightedIndex === filteredSnippets.length - 1
              ) {
                setHighlightedIndex(0);
              } else if (highlightedIndex < filteredSnippets.length - 1) {
                setHighlightedIndex(highlightedIndex + 1);
              }
              event.preventDefault();
            } else if (/^(?:Arrow)?Up$/.test(event.key)) {
              if (highlightedIndex === null || highlightedIndex === 0) {
                setHighlightedIndex(filteredSnippets.length - 1);
              } else if (highlightedIndex > 0) {
                setHighlightedIndex(highlightedIndex - 1);
              }
              event.preventDefault();
            } else if (
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey &&
              /^[a-z0-9!"#$%&'()*+,./:;<=>?@[\] ^_`{|}~-]$/i.test(event.key)
            ) {
              // reset index when character typed in field
              setHighlightedIndex(0);
            } else if (event.key === 'Enter' && highlightedIndex !== null) {
              onSelectSnippet(filteredSnippets[highlightedIndex]);
            }
          }}
          data-testid="filterSnippets"
        />
      </div>
      <ul
        className={styles.snippetsContainer}
        data-testid="snippet-list"
        ref={listEl}
      >
        {filteredSnippets.map((snippet, index) => {
          const isHighlighted = highlightedIndex === index;
          let compiledCode;
          try {
            compiledCode = compileJsx(snippet.code) ?? undefined;
          } catch {}

          return (
            <li
              ref={isHighlighted ? highlightedEl : undefined}
              key={`${snippet.componentName}_${snippet.name}_${index}`}
              className={classnames(styles.snippet, {
                [styles.highlight]: isHighlighted,
              })}
              onMouseMove={
                isHighlighted ? undefined : () => setHighlightedIndex(index)
              }
              onMouseDown={() => onSelectSnippet(filteredSnippets[index])}
            >
              <Text size="large">
                <Strong>{snippet.componentName}</Strong>
                <span className={styles.snippetName}>{snippet.name}</span>
              </Text>
              <div className={styles.snippetBackground}>
                <RenderCode code={compiledCode} scope={components} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
