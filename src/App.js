import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './state/store';
import { WelcomeScreen } from './views/WelcomeScreen';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WelcomeScreen />
      </PersistGate>
    </Provider>
  );
}
