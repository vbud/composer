import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';
import { EditorView } from 'codemirror';

import { ViewPort } from 'src/Canvas/ZoomableCanvas';
import { ColorScheme } from 'src/utils/colorScheme';

export type FileId = string;

interface File {
  id: FileId;
  name: string;
  canvasPosition: CanvasPosition;
  selectedFrameId: SelectedFrameId;
  frames: Frames;
}

type Files = Record<FileId, File>;

export interface CanvasPosition {
  left: number;
  top: number;
  zoom: number;
}

export type FrameId = string;

export interface Frame {
  id: FrameId;
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cursorPosition: number;
}

type Frames = Record<FrameId, Frame>;

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
  dismissable?: boolean;
}

type ToolbarPanel = 'settings' | 'canvasZoomControl';

type CanvasDrawMode = 'frame' | null;

export type SelectedFrameId = string | null;

interface State {
  // persisted state
  files: Files;
  colorScheme: ColorScheme;
  editorWidth: number;
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
  renameFile: (fileId: FileId, newName: string) => void;
  // frame
  createFrame: (fileId: FileId, { x, y }: { x: number; y: number }) => void;
  deleteFrame: (fileId: FileId, frameId: FrameId) => void;
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

export const initialEditorWidth = 400;

const initialState: State = {
  files: {},
  colorScheme: 'system',
  editorWidth: initialEditorWidth,
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
        const newFile = {
          id: crypto.randomUUID(),
          name: 'Untitled',
          canvasPosition: {
            left: 0,
            top: 0,
            zoom: 1,
          },
          selectedFrameId: null,
          frames: {},
        };

        set(
          produce((state) => {
            state.files[newFile.id] = newFile;
          })
        );

        return newFile.id;
      },
      deleteFile: (fileId) =>
        set(
          produce((state) => {
            delete state.files[fileId];
          })
        ),
      renameFile: (fileId, newName) =>
        set(
          produce((state) => {
            state.files[fileId].name = newName;
          })
        ),
      createFrame: (fileId, { x, y }) =>
        set(
          produce((state) => {
            const newFrame = {
              id: crypto.randomUUID(),
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
          produce((state) => {
            const file = state.files[fileId];
            delete file.frames[frameId];
            frameId === file.selectedFrameId && (file.selectedFrameId = null);
          })
        ),
      selectFrame: (fileId, frameId) =>
        set(
          produce((state) => {
            state.files[fileId].selectedFrameId = frameId;
          })
        ),
      moveFrame: (fileId, frameId, { x, y, width, height }) =>
        set(
          produce((state) => {
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

          return produce(baseState, (state) => {
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
          produce((state) => {
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
    }
  )
);
