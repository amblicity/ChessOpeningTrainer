import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BoardView } from '../components/BoardView';
import GameContext from '../state/GameContext';
import scenarios from '../data/scenarios';

export const PlayingScenarioView = () => {
  const { state, dispatch } = useContext(GameContext);

  const scenarioName = 'QueensGambitAccepted';
  const userColor = 'w';
  const scenarioLines = scenarios[scenarioName];

  const completedLines =
    state.completedLinesPerScenario[scenarioName] || new Set();
  const completedLinesArray = Array.from(completedLines);

  const remainingLines = scenarioLines.filter(
    line => !completedLines.has(line.line),
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
        {/* Render completed lines */}
        {completedLinesArray.length > 0 ? (
          completedLinesArray.map((line, index) => (
            <Text key={index} style={styles.headerText}>
              {line}
            </Text>
          ))
        ) : (
          <Text style={styles.headerText}>None</Text>
        )}
        <Text>----</Text>

        <Text style={{ color: 'white', marginBottom: 10 }}>Remaining</Text>
        {/* Render remaining lines */}
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
