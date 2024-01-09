import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const middlewares = [];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const initialAppState = {
  initialized: false,
};

export const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case 'app/initialize': {
      return {
        ...state,
        initialized: action.payload,
      };
    }
    default:
      return state;
  }
};

const initialProgressState = {
  completedLines: {
    QueensGambitAccepted: [],
    KingsIndianDefense: [],
    RuyLopez: [],
    CaroKann: [],
    // all others from json...
  },
};

const progressReducer = (state = initialProgressState, action) => {
  switch (action.type) {
    case 'progress/addCompletedLine': {
      const { scenario, line } = action.payload;
      const completedLinesForScenario = [...state.completedLines[scenario]];

      // Check if the line is already completed to avoid duplicates
      if (!completedLinesForScenario.includes(line)) {
        completedLinesForScenario.push(line);
      }

      return {
        ...state,
        completedLines: {
          ...state.completedLines,
          [scenario]: completedLinesForScenario,
        },
      };
    }

    case 'progress/reset': {
      return initialProgressState;
    }

    default:
      return state;
  }
};

const initialCurrentPlayState = {
  scenario: '',
  startingPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  playingAs: '',
  remainingLines: [],
  line: '',
  moveIndex: 0,
};

export const currentPlayReducer = (state = initialCurrentPlayState, action) => {
  switch (action.type) {
    case 'currentPlay/setScenario': {
      return {
        ...state,
        scenario: action.payload.opening,
        playingAs: action.payload.playingAs,
      };
    }
    case 'currentPlay/setLine': {
      return {
        ...state,
        line: action.payload.line,
        moveIndex: action.payload.moveIndex,
      };
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app: appReducer,
  currentPlay: currentPlayReducer,
  progress: progressReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['currentPlay'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(
  persistedReducer,
  applyMiddleware(...middlewares),
);
export let persistor = persistStore(store);
