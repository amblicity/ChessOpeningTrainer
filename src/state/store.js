import { createStore, applyMiddleware } from 'redux';

const middlewares = [
  /* other middlewares */
];

const createDebugger = require('redux-flipper').default;
middlewares.push(createDebugger());

import { combineReducers } from 'redux';

export const appReducer = (state = {}, action) => {
  switch (action.type) {
    case 'app/init': {
      return {
        ...state,
        app: [...state.app],
      };
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  app: appReducer,
});

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
