import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from './src/state/GameContext';
import { PlayingScenarioView } from './src/views/PlayingScenarioView';
import { store } from './src/state/store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectScenarioView } from './src/views/SelectScenarioView';

export const App = () => {
  // console.log('Initial state: ', store.getState());
  // store.dispatch({ type: 'app/initialize', payload: true });
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <GameProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Select Opening"
              component={SelectScenarioView}
            />
          </Stack.Navigator>
          {/*<View style={styles.container}>*/}
          {/*  <PlayingScenarioView />*/}
          {/*</View>*/}
        </NavigationContainer>
      </GameProvider>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkblue',
  },
  header: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
  },
  linesInfo: {},
  infoText: {
    color: 'white',
  },
  lineText: {
    color: 'white',
  },
});
