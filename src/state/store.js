import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { progressReducer } from './reducer/progressReducer';
import { currentPlayReducer } from './reducer/currentPlayReducer';
import { appReducer } from './reducer/appReducer';
import { dbReducer } from './reducer/dbReducer';

const middlewares = [];

if (__DEV__) {
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
