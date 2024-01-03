import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BoardView } from '../components/BoardView';
import openingData from '../data/openingdb.json';

import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';

const currentScenarioSelector = state => state.currentPlay.scenario;

export const PlayingScenarioView = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [commentaryForNextMove, setCommentaryForNextMove] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setShowHelp(c => !c)} title={'Help'} />
      ),
    });
  }, [navigation]);

  const currentLine = useSelector(state => state.currentPlay.line);
  const currentMoveIndex = useSelector(state => state.currentPlay.moveIndex);

  const scenarioName = useSelector(currentScenarioSelector);
  const completedLines = useSelector(
    state => state.progress.completedLines[scenarioName],
  );
  const openings = openingData.openings;

  const userColor = useSelector(state => state.currentPlay.playingAs);
  const scenarioLines =
    openings.find(opening => opening.key === scenarioName)?.variations || [];

  const remainingLines = scenarioLines.filter(
    line => !completedLines.includes(line.line),
  );

  useEffect(() => {
    const comment = scenarioLines.find(variation => {
      console.log('variation.line', variation.line);
      console.log('currentline', currentLine);
      if (variation.line === currentLine) {
        console.log(
          'comment in variation: ',
          variation.commentary[currentMoveIndex + 1],
        );
        setCommentaryForNextMove(variation.commentary[currentMoveIndex + 1]);
      }
    });
  }, [currentLine, currentMoveIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{scenarioName}</Text>
        <Text style={styles.headerText}>Playing as {userColor}</Text>
      </View>
      <BoardView
        fen={openingData.startingFEN}
        scenarioName={scenarioName}
        color={userColor}
      />
      <View style={styles.linesList}>
        <Text style={{ color: 'black', marginBottom: 10 }}>Completed</Text>
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

        <Text style={{ color: 'black', marginBottom: 10 }}>Remaining</Text>
        {remainingLines.map((list, index) => (
          <Text key={index} style={styles.headerText}>
            {list.line}
          </Text>
        ))}
      </View>
      {showHelp === true && (
        <BlurView
          style={styles.absolute}
          blurType="prominent"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      )}
      {showHelp === true && (
        <View
          style={[
            styles.absolute,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setShowHelp(false);
            }}>
            <Text>{commentaryForNextMove}</Text>
            <Text>CLOSE</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#edf4fe',
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
    color: 'black',
  },
  linesInfo: {},
  infoText: {
    color: 'black',
  },
  lineText: {
    color: 'black',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
