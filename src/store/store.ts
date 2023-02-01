import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';
import { EditorView } from 'codemirror';

import { ViewPort } from 'src/Canvas/ZoomableCanvas';
import { ColorScheme } from 'src/utils/colorScheme';

export type FileId = string;

export interface File {
  id: FileId;
  name: string;
  canvasPosition: CanvasPosition;
  selectedFrameId: SelectedFrameId;
  frames: FileFrames;
}

export type Files = Record<FileId, File>;

export interface CanvasPosition {
  left: number;
  top: number;
  zoom: number;
}

export type FrameId = string;

// TODO: FileFrame => Frame?
export interface FileFrame {
  id: FrameId;
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cursorPosition: number;
}

export type FileFrames = Record<FrameId, FileFrame>;

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
  dismissable?: boolean;
}

type ToolbarPanel = 'settings' | 'canvasZoomControl';

export type SelectedFrameId = string | null;

interface State {
  files: Files;
  showSnippets: boolean;
  showCanvasOnly: boolean;
  colorScheme: ColorScheme;
  editorWidth: number;
  editorView: EditorView | null;
  canvasViewport: ViewPort | null;
  activeToolbarPanel: ToolbarPanel | null;
  statusMessage: StatusMessage | null;
}

interface Actions {
  // file
  createFile: () => FileId;
  deleteFile: (fileId: FileId) => void;
  renameFile: (fileId: FileId, newName: string) => void;
  // frame
  createFrame: (fileId: FileId) => void;
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
  // other app state
  toggleShowSnippets: () => void;
  toggleShowCanvasOnly: () => void;
  updateEditorWidth: (editorWidth: number) => void;
  updateColorScheme: (colorScheme: ColorScheme) => void;
}

export const initialEditorWidth = 400;

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      /* STATE */
      files: {},
      showSnippets: false,
      showCanvasOnly: false,
      colorScheme: 'system',
      editorWidth: initialEditorWidth,
      editorView: null,
      canvasViewport: null,
      activeToolbarPanel: null,
      statusMessage: null,

      /* ACTIONS */
      // file
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

      // frame
      createFrame: (fileId) =>
        set(
          produce((state) => {
            const newFrame = {
              id: crypto.randomUUID(),
              code: '<>\n  \n</>',
              x: 0,
              y: 0,
              width: 500,
              height: 500,
              // Cursor should be located between the React Fragment start and end tags
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
            file.selectedFrameId = null;
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
      // editor
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

      // canvas
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

      // status message
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

      // toolbar panel
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

      // other app state
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
