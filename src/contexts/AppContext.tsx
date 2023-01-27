import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import { store } from 'src/stores';

import { ColorScheme, useColorScheme } from 'src/utils/colorScheme';

export interface AppState {
  colorScheme: ColorScheme;
  editorWidth: number;
}

type Action =
  | { type: 'initialLoad'; payload: Partial<AppState> }
  | {
      type: 'updateColorScheme';
      payload: ColorScheme;
    }
  | { type: 'updateEditorWidth'; payload: AppState['editorWidth'] };

const createReducer =
  () =>
  (state: AppState, action: Action): AppState => {
    switch (action.type) {
      case 'initialLoad': {
        return {
          ...state,
          ...action.payload,
        };
      }
      case 'updateColorScheme': {
        const colorScheme = action.payload;
        store.setItem('colorScheme', colorScheme);

        return {
          ...state,
          colorScheme,
        };
      }
      case 'updateEditorWidth': {
        const editorWidth = action.payload;
        store.setItem('editorWidth', editorWidth);

        return {
          ...state,
          editorWidth,
        };
      }
    }
  };

export const initialEditorWidth = 400;

const initialState: AppState = {
  colorScheme: 'system',
  editorWidth: initialEditorWidth,
};

export const AppContext = createContext<[AppState, Dispatch<Action>]>([
  initialState,
  () => {},
]);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(createReducer(), initialState);

  useEffect(() => {
    Promise.all([
      store.getItem<AppState['colorScheme']>('colorScheme'),
      store.getItem<AppState['editorWidth']>('editorWidth'),
    ]).then(([colorScheme, editorWidth]) => {
      const payload: Partial<AppState> = {};

      colorScheme && (payload.colorScheme = colorScheme);
      editorWidth && (payload.editorWidth = editorWidth);

      dispatch({
        type: 'initialLoad',
        payload,
      });
    });
  }, []);

  useColorScheme(state.colorScheme);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};
