import React from 'react';
import { Button } from 'react-native';
import { CurrentPlayView } from './src/components/views/CurrentPlayView';
import { persistor, store } from './src/state/store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectOpeningView } from './src/components/views/SelectOpeningView';
import { PersistGate } from 'redux-persist/integration/react';
import { WelcomeScreen } from './src/components/views/WelcomeScreen';
import { HelpFullScreenView } from './src/components/views/notinuse/HelpFullScreenView';

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
                  headerTitle: '',
                  headerTransparent: true,
                  headerBackTitleVisible: false,
                  headerTintColor: '#6292B7',
                }}
              />
              <appStack.Screen
                name="Play Opening Lines"
                component={CurrentPlayView}
                options={({ navigation, route }) => ({
                  headerRight: () => <Button title="Help" />,
                  headerTransparent: true,
                  headerTitle: '',
                  headerBackTitleVisible: false,
                  headerTintColor: '#6292B7',
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
