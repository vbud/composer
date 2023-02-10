import { editorWidths } from 'src/CodeEditor/ResizableCodeEditor';
import { componentSnippets } from 'src/snippets';
import { toolbarHeight } from 'src/Toolbar/Toolbar.css';
import { formatCode } from 'src/utils/formatting';
import { objectEntries, objectKeys } from 'ts-extras';
import { FileId, Files, Frames } from '.';

const exampleIdPrefix = 'example_';

export function isExampleId(fileId: FileId): boolean {
  return fileId.startsWith(exampleIdPrefix);
}

const fileIds = {
  tables: `${exampleIdPrefix}tables`,
  alerts: `${exampleIdPrefix}alerts`,
};

// a reasonable guess at a starting position that will put the first few frames
// in view for the user
const canvasPosition = {
  left: -editorWidths.default - 32,
  top: -toolbarHeight - 128,
  zoom: 1,
};

export const exampleFiles: Files = {
  [fileIds.tables]: {
    id: fileIds.tables,
    name: 'Example: tables',
    canvasPosition,
    selectedFrameId: componentSnippets.Table[0].name,
    frames: componentSnippets.Table.reduce<Frames>(
      (frames, { name, code }, i) => {
        const id = name;
        const size = 400;
        frames[id] = {
          id,
          name,
          code,
          x: i * (size + 32),
          y: 0,
          width: size,
          height: size,
          cursorPosition: 0,
        };
        return frames;
      },
      {}
    ),
  },
  [fileIds.alerts]: {
    id: fileIds.alerts,
    name: 'Example: alerts',
    canvasPosition,
    selectedFrameId: objectKeys(componentSnippets.Alert)[0],
    frames: objectEntries(componentSnippets.Alert).reduce<Frames>(
      (frames, [group, snippetDefinitions], i) => {
        const id = group;
        const size = 400;
        const code = formatCode({
          code: `<>${snippetDefinitions.map(({ code }) => code).join('')}</>`,
          cursor: 0,
        }).code;
        frames[id] = {
          id,
          name: group,
          code,
          x: i * (size + 32),
          y: 0,
          width: size,
          height: size,
          cursorPosition: 0,
        };
        return frames;
      },
      {}
    ),
  },
};
