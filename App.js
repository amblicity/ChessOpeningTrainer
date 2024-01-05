import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { GameProvider } from './src/state/GameContext';
import { PlayingScenarioView } from './src/views/PlayingScenarioView';
import { store, persistor } from './src/state/store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectScenarioView } from './src/views/SelectScenarioView';
import { PersistGate } from 'redux-persist/integration/react';
import { WelcomeScreen } from './src/views/WelcomeScreen';
import { HelpFullScreenView } from './src/views/HelpFullScreenView';

export const App = () => {
  // console.log('Initial state: ', store.getState());
  // store.dispatch({ type: 'app/initialize', payload: true });
  const appStack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <appStack.Navigator initialRouteName={'SelectOpening'}>
            <appStack.Group>
              <appStack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                  headerTransparent: true,
                  headerBackTitleVisible: false,
                }}
              />
              <appStack.Screen
                name="SelectOpening"
                component={SelectScenarioView}
                options={{
                  headerTransparent: true,
                  headerBackTitleVisible: false,
                }}
              />
              <appStack.Screen
                name="Play Opening Lines"
                component={PlayingScenarioView}
                options={({ navigation, route }) => ({
                  headerRight: () => <Button title="Help" />,
                  headerTransparent: true,
                  headerBackTitleVisible: false,
                })}
              />
            </appStack.Group>
            <appStack.Group screenOptions={{ presentation: 'modal' }}>
              <appStack.Screen
                name="FullScreenHelpModal"
                component={HelpFullScreenView}
              />
            </appStack.Group>
          </appStack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};
