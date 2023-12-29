import { createStore, applyMiddleware } from 'redux';

const middlewares = [
  /* other middlewares */
];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

import { combineReducers } from 'redux';

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

const initialCurrentPlayState = {
  scenario: 'QueensGambitAccepted',
  playingAs: 'w',
  completedLines: [],
  remainingLines: [],
};

export const currentPlayReducer = (state = initialCurrentPlayState, action) => {
  switch (action.type) {
    case 'currentPlay/setScenario': {
      return {
        ...state,
        scenario: action.payload,
      };
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app: appReducer,
  currentPlay: currentPlayReducer,
});

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
