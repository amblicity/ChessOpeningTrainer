import React from 'react';
import { Button } from 'react-native';
import { PlayOpeningView } from './src/views/PlayOpeningView';
import { persistor, store } from './src/state/store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectOpeningView } from './src/views/SelectOpeningView';
import { PersistGate } from 'redux-persist/integration/react';
import { WelcomeScreen } from './src/views/WelcomeScreen';
import { HelpFullScreenView } from './src/views/HelpFullScreenView';

export const App = () => {
  const appStack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <appStack.Navigator initialRouteName={'Welcome'}>
            <appStack.Group>
              <appStack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={() => ({
                  headerRight: () => <Button title="Help" />,
                  headerTransparent: true,
                  headerTitle: '',
                  headerBackTitleVisible: false,
                })}
              />
              <appStack.Screen
                name="SelectOpening"
                component={SelectOpeningView}
                options={{
                  headerTransparent: true,
                  headerBackTitleVisible: false,
                }}
              />
              <appStack.Screen
                name="Play Opening Lines"
                component={PlayOpeningView}
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
