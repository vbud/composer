import { EditorView } from 'codemirror';
import produce from 'immer';
import { cloneDeep } from 'lodash';
import { ViewPort } from 'src/Canvas/ZoomableCanvas';
import { initialEditorWidth } from 'src/CodeEditor/ResizableCodeEditor';
import invariant from 'ts-invariant';
import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exampleFiles, isExampleId } from './exampleFiles';

export { shallow } from 'zustand/shallow';

const FileId = z.string();
export type FileId = z.infer<typeof FileId>;

const FrameId = z.string();
export type FrameId = z.infer<typeof FrameId>;

const SelectedFrameId = FrameId.nullable();
export type SelectedFrameId = z.infer<typeof SelectedFrameId>;

const CanvasPosition = z.object({
  left: z.number(),
  top: z.number(),
  zoom: z.number(),
});
export type CanvasPosition = z.infer<typeof CanvasPosition>;

const Frame = z.object({
  id: FrameId,
  name: z.string(),
  code: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  cursorPosition: z.number(),
});
export type Frame = z.infer<typeof Frame>;

const Frames = z.record(FrameId, Frame);
export type Frames = z.infer<typeof Frames>;

const File = z.object({
  id: FileId,
  name: z.string(),
  canvasPosition: CanvasPosition,
  selectedFrameId: SelectedFrameId,
  frames: Frames,
});
export type File = z.infer<typeof File>;

const Files = z.record(FileId, File);
export type Files = z.infer<typeof Files>;

export const ColorScheme = z.union([
  z.literal('light'),
  z.literal('dark'),
  z.literal('system'),
]);
export type ColorScheme = z.infer<typeof ColorScheme>;

const PersistedState = z.object({
  files: Files,
  colorScheme: ColorScheme,
  editorWidth: z.number(),
});
type PersistedState = z.infer<typeof PersistedState>;

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
  dismissable?: boolean;
}

type ToolbarPanel = 'settings' | 'canvasZoomControl';

type CanvasDrawMode = 'frame' | null;

interface State extends PersistedState {
  // non-persisted state
  editorView: EditorView | null;
  canvasViewport: ViewPort | null;
  showSnippets: boolean;
  showCanvasOnly: boolean;
  activeToolbarPanel: ToolbarPanel | null;
  statusMessage: StatusMessage | null;
  canvasDrawMode: CanvasDrawMode | null;
}

interface Actions {
  // file
  createFile: () => FileId;
  deleteFile: (fileId: FileId) => void;
  renameFile: (fileId: FileId, name: string) => void;
  copyExampleFile: (fileId: FileId) => FileId;
  // frame
  createFrame: (fileId: FileId, { x, y }: { x: number; y: number }) => void;
  deleteFrame: (fileId: FileId, frameId: FrameId) => void;
  renameFrame: (fileId: FileId, frameId: FrameId, name: string) => void;
  selectFrame: (fileId: FileId, frameId: SelectedFrameId) => void;
  moveFrame: (
    fileId: FileId,
    frameId: FrameId,
    {
      x,
      y,
      width,
      height,
    }: { x?: number; y?: number; width?: number; height?: number }
  ) => void;
  updateFrameEditorState: (
    fileId: FileId,
    frameId: FrameId,
    {
      code,
      cursorPosition,
    }: {
      code: string;
      cursorPosition: number;
    }
  ) => void;
  // editor
  initializeEditor: (editorView: EditorView) => void;
  destroyEditor: () => void;
  // canvas
  initializeCanvas: (canvasViewport: ViewPort) => void;
  destroyCanvas: () => void;
  saveCanvasPosition: (fileId: FileId, canvasPosition: CanvasPosition) => void;
  // status message
  displayStatusMessage: (statusMessage: StatusMessage) => void;
  dismissStatusMessage: () => void;
  // toolbar panel
  openToolbarPanel: (panel: ToolbarPanel) => void;
  closeToolbarPanel: () => void;
  // other UI state
  updateEditorWidth: (editorWidth: number) => void;
  updateColorScheme: (colorScheme: ColorScheme) => void;
  toggleShowSnippets: () => void;
  toggleShowCanvasOnly: () => void;
  setCanvasDrawMode: (canvasDrawMode: CanvasDrawMode) => void;
  resetFileUIState: () => void;
}

const initiatePersistedState: PersistedState = {
  files: {},
  colorScheme: 'system',
  editorWidth: initialEditorWidth,
} as const;
const initialState: State = {
  ...initiatePersistedState,
  editorView: null,
  canvasViewport: null,
  activeToolbarPanel: null,
  statusMessage: null,
  canvasDrawMode: null,
  showSnippets: false,
  showCanvasOnly: false,
} as const;

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      createFile: () => {
        const newFileId = crypto.randomUUID();

        set(
          produce<State>((state) => {
            state.files[newFileId] = {
              id: newFileId,
              name: 'Untitled',
              canvasPosition: {
                left: 0,
                top: 0,
                zoom: 1,
              },
              selectedFrameId: null,
              frames: {},
            };
          })
        );

        return newFileId;
      },
      deleteFile: (fileId) =>
        set(
          produce<State>((state) => {
            delete state.files[fileId];
          })
        ),
      renameFile: (fileId, name) =>
        set(
          produce<State>((state) => {
            state.files[fileId].name = name;
          })
        ),
      copyExampleFile: (exampleFileId) => {
        invariant(
          isExampleId(exampleFileId),
          'Only example files can be copied.'
        );
        const newFileId = crypto.randomUUID();

        set(
          produce<State>((state) => {
            const copy = cloneDeep(state.files[exampleFileId]);
            state.files[newFileId] = {
              ...copy,
              id: newFileId,
              name: `Copy of ${copy.name}`,
            };
            state.files[exampleFileId] = exampleFiles[exampleFileId];
          })
        );

        return newFileId;
      },
      createFrame: (fileId, { x, y }) =>
        set(
          produce<State>((state) => {
            const newFrame: Frame = {
              id: crypto.randomUUID(),
              name: 'Frame',
              code: '<>\n  \n</>',
              x,
              y,
              width: 400,
              height: 400,
              // cursor should be located between the React Fragment start and end tags
              cursorPosition: 5,
            };
            const file = state.files[fileId];
            file.frames[newFrame.id] = newFrame;
            file.selectedFrameId = newFrame.id;
          })
        ),
      deleteFrame: (fileId, frameId) =>
        set(
          produce<State>((state) => {
            const file = state.files[fileId];
            delete file.frames[frameId];
            frameId === file.selectedFrameId && (file.selectedFrameId = null);
          })
        ),
      renameFrame: (fileId, frameId, name) =>
        set(
          produce<State>((state) => {
            state.files[fileId].frames[frameId].name = name;
          })
        ),
      selectFrame: (fileId, frameId) =>
        set(
          produce<State>((state) => {
            state.files[fileId].selectedFrameId = frameId;
          })
        ),
      moveFrame: (fileId, frameId, { x, y, width, height }) =>
        set(
          produce<State>((state) => {
            const frame = state.files[fileId].frames[frameId];
            x !== undefined && (frame.x = x);
            y !== undefined && (frame.y = y);
            width !== undefined && (frame.width = width);
            height !== undefined && (frame.height = height);
          })
        ),
      updateFrameEditorState: (fileId, frameId, { code, cursorPosition }) =>
        set((baseState) => {
          const { code: currentCode, cursorPosition: currentCursorPosition } =
            baseState.files[fileId].frames[frameId];
          if (code === currentCode && cursorPosition === currentCursorPosition)
            return baseState;

          return produce<State>(baseState, (state) => {
            const frame = state.files[fileId].frames[frameId];
            frame.code = code;
            frame.cursorPosition = cursorPosition;
          });
        }),

      initializeEditor: (editorView) =>
        set((state) => ({
          ...state,
          editorView,
        })),
      destroyEditor: () =>
        set((state) => {
          state.editorView?.destroy();
          return {
            ...state,
            editorView: null,
          };
        }),
      initializeCanvas: (canvasViewport) =>
        set((state) => ({
          ...state,
          canvasViewport,
        })),
      destroyCanvas: () =>
        set((state) => ({
          ...state,
          canvasViewport: null,
        })),
      saveCanvasPosition: (fileId, canvasPosition) =>
        set(
          produce<State>((state) => {
            state.files[fileId].canvasPosition = canvasPosition;
          })
        ),
      displayStatusMessage: (statusMessage) =>
        set((state) => ({
          ...state,
          statusMessage,
        })),
      dismissStatusMessage: () =>
        set((state) => ({
          ...state,
          statusMessage: null,
        })),
      openToolbarPanel: (panel) =>
        set((state) => {
          const shouldOpen = panel !== state.activeToolbarPanel;

          if (shouldOpen) {
            return {
              ...state,
              activeToolbarPanel: panel,
            };
          }

          return state;
        }),
      closeToolbarPanel: () =>
        set((state) => ({
          ...state,
          activeToolbarPanel: null,
        })),
      updateEditorWidth: (editorWidth) =>
        set((state) => ({
          ...state,
          editorWidth,
        })),
      updateColorScheme: (colorScheme) =>
        set((state) => ({
          ...state,
          colorScheme,
        })),
      toggleShowSnippets: () =>
        set((state) => ({
          ...state,
          showSnippets: !state.showSnippets,
        })),
      toggleShowCanvasOnly: () =>
        set((state) => {
          const newState = {
            ...state,
            showCanvasOnly: !state.showCanvasOnly,
          };
          if (newState.showCanvasOnly) {
            newState.activeToolbarPanel = null;
          }

          return newState;
        }),
      setCanvasDrawMode: (canvasDrawMode) =>
        set((state) => ({
          ...state,
          canvasDrawMode,
        })),

      // reset all non-persisted UI state, except for `canvasViewport` and
      // `editorView`, which are reset by `destroyCanvas` and `destroyEditor`
      resetFileUIState: () =>
        set((state) => ({
          ...state,
          activeToolbarPanel: initialState.activeToolbarPanel,
          statusMessage: initialState.statusMessage,
          showSnippets: initialState.showSnippets,
          showCanvasOnly: initialState.showCanvasOnly,
        })),
    }),
    {
      name: 'composer-storage',
      partialize: (state) => ({
        files: state.files,
        colorScheme: state.colorScheme,
        editorWidth: state.editorWidth,
      }),
      merge: (persistedStateUnvalidated, currentState) => {
        let persistedState: PersistedState = initiatePersistedState;
        const result = PersistedState.safeParse(persistedStateUnvalidated);
        if (result.success) {
          persistedState = result.data;
        }

        return {
          ...currentState,
          ...persistedState,
          files: {
            ...currentState.files,
            ...persistedState.files,
            // we use a custom merge function to deep merge files so that we can
            // append the hard-coded example files here
            ...exampleFiles,
          },
        };
      },
    }
  )
);
