import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import {
  createRoutesFromElements,
  createHashRouter,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { store, persistor } from './state/store';
import { SelectOpeningView } from './components/views/SelectOpeningView';
import { WelcomeScreen } from './components/views/WelcomeScreen';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<WelcomeScreen />} />
      <Route path="SelectOpening" element={<SelectOpeningView />} />
    </Route>,
  ),
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}
