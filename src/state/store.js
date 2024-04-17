import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { progressReducer } from './progressReducer';
import { currentPlayReducer } from './currentPlayReducer';
import { appReducer } from './appReducer';
import { dbReducer } from './dbReducer';

const middlewares = [];

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV;

if (isDev) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const rootReducer = combineReducers({
  app: appReducer,
  currentPlay: currentPlayReducer,
  progress: progressReducer,
  db: dbReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['currentPlay', 'progress', 'app', 'db'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(
  persistedReducer,
  applyMiddleware(...middlewares),
);
export let persistor = persistStore(store);
