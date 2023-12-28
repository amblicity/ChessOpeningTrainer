import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from './src/state/GameContext';
import { PlayingScenarioView } from './src/views/PlayingScenarioView'; // Adjust the import path as needed

export const App = () => {
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
  linesInfo: {
    // Style for the scoreboard area
  },
  infoText: {
    // Style for the headers (Completed Lines, Remaining Lines)
    color: 'white',
  },
  lineText: {
    // Style for individual line names
    color: 'white',
  },
});
