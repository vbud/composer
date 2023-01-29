import React, {
  useEffect,
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import { EditorView } from 'codemirror';

import { store, fileFramesStore } from 'src/stores';
import { ViewPort } from 'src/Canvas/ZoomableCanvas';
import invariant from 'ts-invariant';

export type FileId = string;

export interface File {
  id: FileId;
  name: string;
  canvasPosition: CanvasPosition;
  selectedFrameId: SelectedFrameId;
}

export type Files = Record<FileId, File>;

export interface CanvasPosition {
  left: number;
  top: number;
  zoom: number;
}

export type FrameId = string;

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
}

type ToolbarPanel = 'settings' | 'canvasZoomControl';

export type SelectedFrameId = string | null;

export interface FileState {
  files: Files;
  fileFrames: FileFrames;
  canvasPosition: CanvasPosition;
  selectedFrameId: SelectedFrameId;
  activeFileId: FileId;
  activeFileName: string;
  canvasViewport: ViewPort | null;
  editorView: EditorView | null;
  activeToolbarPanel?: ToolbarPanel;
  showSnippets: boolean;
  showCanvasOnly: boolean;
  statusMessage?: StatusMessage;
}

export interface UpdateEditorStatePayload {
  code: string;
  cursorPosition: number;
}

type Action =
  | { type: 'initialLoad'; payload: Partial<FileState> }
  | { type: 'initializeEditor'; payload: { editorView: EditorView } }
  | { type: 'destroyEditor' }
  | {
      type: 'updateEditorState';
      payload: UpdateEditorStatePayload;
    }
  | { type: 'initializeCanvas'; payload: { canvasViewport: ViewPort } }
  | { type: 'addFrame' }
  | {
      type: 'moveFrame';
      payload: {
        id: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
      };
    }
  | { type: 'deleteFrame'; payload: FrameId }
  | { type: 'selectFrame'; payload: SelectedFrameId }
  | { type: 'toggleToolbar'; payload: { panel: ToolbarPanel } }
  | { type: 'closeToolbar' }
  | { type: 'toggleSnippets' }
  | { type: 'toggleShowCanvasOnly' }
  | { type: 'displayStatusMessage'; payload: StatusMessage }
  | { type: 'dismissMessage' }
  | { type: 'saveCanvasPosition'; payload: FileState['canvasPosition'] };

const createReducer =
  () =>
  (state: FileState, action: Action): FileState => {
    switch (action.type) {
      case 'initialLoad': {
        return {
          ...state,
          ...action.payload,
        };
      }

      case 'initializeEditor': {
        const { editorView } = action.payload;
        return {
          ...state,
          editorView,
        };
      }

      case 'destroyEditor': {
        state.editorView?.destroy();
        return {
          ...state,
          editorView: null,
        };
      }

      case 'updateEditorState': {
        if (!state.selectedFrameId) return state;

        const { code, cursorPosition } = action.payload;
        const { code: currentCode, cursorPosition: currentCursorPosition } =
          state.fileFrames[state.selectedFrameId];

        if (code !== currentCode || cursorPosition !== currentCursorPosition) {
          const fileFrames = {
            ...state.fileFrames,
            [state.selectedFrameId]: {
              ...state.fileFrames[state.selectedFrameId],
              code,
              cursorPosition,
            },
          };
          fileFramesStore.setItem<FileState['fileFrames']>(
            state.activeFileId,
            fileFrames
          );

          return {
            ...state,
            fileFrames,
          };
        }

        return state;
      }

      case 'initializeCanvas': {
        const { canvasViewport } = action.payload;
        return {
          ...state,
          canvasViewport,
        };
      }

      case 'addFrame': {
        const newFrameId = crypto.randomUUID();
        const fileFrames = {
          ...state.fileFrames,
          [newFrameId]: {
            id: newFrameId,
            code: '<>\n  \n</>',
            x: 0,
            y: 0,
            width: 500,
            height: 500,
            // Cursor should be located between the React Fragment start and end tags
            cursorPosition: 5,
          },
        };

        fileFramesStore.setItem<FileState['fileFrames']>(
          state.activeFileId,
          fileFrames
        );
        const files = {
          ...state.files,
          [state.activeFileId]: {
            ...state.files[state.activeFileId],
            selectedFrameId: newFrameId,
          },
        };
        store.setItem<FileState['files']>('files', files);
        return {
          ...state,
          fileFrames,
          selectedFrameId: null,
        };
      }

      case 'deleteFrame': {
        const fileFrames = { ...state.fileFrames };
        delete fileFrames[action.payload];

        fileFramesStore.setItem<FileState['fileFrames']>(
          state.activeFileId,
          fileFrames
        );
        const files = {
          ...state.files,
          [state.activeFileId]: {
            ...state.files[state.activeFileId],
            selectedFrameId: null,
          },
        };
        store.setItem<FileState['files']>('files', files);
        return {
          ...state,
          fileFrames,
          selectedFrameId: null,
        };
      }

      case 'moveFrame': {
        const { id, x, y, width, height } = action.payload;
        const updatedFrame = { ...state.fileFrames[id] };

        if (x !== undefined) {
          updatedFrame.x = x;
        }
        if (y !== undefined) {
          updatedFrame.y = y;
        }
        if (width !== undefined) {
          updatedFrame.width = width;
        }
        if (height !== undefined) {
          updatedFrame.height = height;
        }

        const fileFrames = {
          ...state.fileFrames,
          [id]: updatedFrame,
        };
        fileFramesStore.setItem<FileState['fileFrames']>(
          state.activeFileId,
          fileFrames
        );
        return {
          ...state,
          fileFrames,
        };
      }

      case 'selectFrame': {
        const selectedFrameId = action.payload;

        const files = {
          ...state.files,
          [state.activeFileId]: {
            ...state.files[state.activeFileId],
            selectedFrameId,
          },
        };
        store.setItem<FileState['files']>('files', files);

        return {
          ...state,
          files,
          selectedFrameId,
        };
      }

      case 'displayStatusMessage': {
        return {
          ...state,
          statusMessage: action.payload,
        };
      }

      case 'dismissMessage': {
        return {
          ...state,
          statusMessage: undefined,
        };
      }

      case 'toggleToolbar': {
        const { panel } = action.payload;
        const { activeToolbarPanel: currentPanel, ...currentState } = state;
        const shouldOpen = panel !== currentPanel;

        if (shouldOpen) {
          return {
            ...currentState,
            statusMessage: undefined,
            activeToolbarPanel: panel,
          };
        }

        return currentState;
      }

      case 'closeToolbar': {
        return {
          ...state,
          activeToolbarPanel: undefined,
        };
      }

      case 'toggleSnippets': {
        return {
          ...state,
          showSnippets: !state.showSnippets,
        };
      }

      case 'toggleShowCanvasOnly': {
        const newState = {
          ...state,
          showCanvasOnly: !state.showCanvasOnly,
        };
        if (newState.showCanvasOnly) {
          newState.activeToolbarPanel = undefined;
        }

        return newState;
      }

      case 'saveCanvasPosition': {
        const canvasPosition = action.payload;
        const files = {
          ...state.files,
          [state.activeFileId]: {
            ...state.files[state.activeFileId],
            canvasPosition,
          },
        };
        store.setItem<FileState['files']>('files', files);
        return {
          ...state,
          files,
          canvasPosition,
        };
      }

      default:
        return state;
    }
  };

const initialState: FileState = {
  files: {},
  fileFrames: {},
  showSnippets: false,
  showCanvasOnly: false,
  editorView: null,
  canvasViewport: null,
  canvasPosition: {
    left: 0,
    top: 0,
    zoom: 1,
  },
  selectedFrameId: null,
  // The below values are never actually used since we never load a File without
  // loading it from the database. We just do this to avoid having to make them
  // an optional property.
  activeFileId: '_',
  activeFileName: '_',
};

export const FileContext = createContext<[FileState, Dispatch<Action>]>([
  initialState,
  () => {},
]);

export const FileContextProvider = ({
  children,
  fileId,
}: {
  children: ReactNode;
  fileId: FileId;
}) => {
  const [state, dispatch] = useReducer(createReducer(), initialState);

  useEffect(() => {
    Promise.all([
      store.getItem<FileState['files']>('files'),
      fileFramesStore.getItem<FileState['fileFrames']>(fileId),
    ]).then(([files, fileFrames]) => {
      invariant(files, 'files must exist in store');
      invariant(
        fileFrames,
        `fileFrames for file id ${fileId} must exist in store`
      );

      const { canvasPosition, selectedFrameId, name } = files[fileId];

      dispatch({
        type: 'initialLoad',
        payload: {
          activeFileId: fileId,
          activeFileName: name,
          files,
          canvasPosition,
          selectedFrameId,
          fileFrames,
        },
      });
    });
  }, [fileId]);

  return fileId === state.activeFileId ? (
    <FileContext.Provider value={[state, dispatch]}>
      {children}
    </FileContext.Provider>
  ) : null;
};
