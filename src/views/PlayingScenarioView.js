import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BoardView } from '../components/BoardView';
import scenarios from '../data/scenarios';
import { useSelector } from 'react-redux';

const currentScenarioSelector = state => state.currentPlay.scenario;

export const PlayingScenarioView = () => {
  const scenarioName = useSelector(currentScenarioSelector);
  const completedLines = useSelector(
    state => state.progress.completedLines[scenarioName],
  );

  const userColor = useSelector(state => state.currentPlay.playingAs);
  const scenarioLines = scenarios[scenarioName];

  const remainingLines = scenarioLines.filter(
    line => !completedLines.includes(line.line),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{scenarioName}</Text>
        <Text style={styles.headerText}>Playing as {userColor}</Text>
      </View>
      <BoardView
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        scenarioName={scenarioName}
        color={userColor}
      />
      <View style={styles.linesList}>
        <Text style={{ color: 'white', marginBottom: 10 }}>Completed</Text>
        {completedLines.length > 0 ? (
          completedLines.map((line, index) => (
            <Text key={index} style={styles.headerText}>
              {line}
            </Text>
          ))
        ) : (
          <Text style={styles.headerText}>None</Text>
        )}
        <Text>----</Text>

        <Text style={{ color: 'white', marginBottom: 10 }}>Remaining</Text>
        {remainingLines.map((list, index) => (
          <Text key={index} style={styles.headerText}>
            {list.line}
          </Text>
        ))}
      </View>
    </View>
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
  linesList: {
    marginTop: 20,
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
