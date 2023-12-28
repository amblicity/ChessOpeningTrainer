import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from './src/state/GameContext';
import { PlayingScenarioView } from './src/views/PlayingScenarioView';
import { store } from './src/state/store';

export const App = () => {
  console.log('Initial state: ', store.getState());
  store.dispatch({ type: 'app/initialize', payload: true });

  return (
    <GameProvider>
      <View style={styles.container}>
        <PlayingScenarioView />
      </View>
    </GameProvider>
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
