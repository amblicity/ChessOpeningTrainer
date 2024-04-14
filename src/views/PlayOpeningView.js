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
import {
  getCompletedVariationsByOpeningKey,
  getMovesByOpeningAndVariationKey,
} from '../state/selectors';

const openings = openingData.openings;
const currentlySelectedOpening = state => state.currentPlay.selectedOpening;

export const PlayOpeningView = () => {
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

  const selectedOpeningName = useSelector(currentlySelectedOpening);
  const userColor = useSelector(state => state.currentPlay.playingAs);

  const allVariationsInOpening =
    openings.find(opening => opening.key === selectedOpeningName)?.variations ||
    [];

  // console.log('allVariationsInOpening', allVariationsInOpening);

  const completedVariations = useSelector(state =>
    getCompletedVariationsByOpeningKey(state, 'CaroKann'),
  );

  const moves = useSelector(state =>
    getMovesByOpeningAndVariationKey(state, 'CaroKann', 'QICK'),
  );

  console.log(moves);

  // console.log('completedVariations', completedVariations);

  const remainingVariations = allVariationsInOpening.filter(
    line => !completedVariations.includes(line.variationKey),
  );

  // console.log('remainingVariations', remainingVariations);

  const currentVariationKey = useSelector(
    state => state.currentPlay.variationKey,
  );
  console.log('currentVariation', currentVariationKey);
  const currentMoveIndex = useSelector(state => state.currentPlay.moveIndex);

  useEffect(() => {
    allVariationsInOpening.find(variation => {
      if (variation.variationKey === currentVariationKey) {
        console.log(
          'comment in variation: ',
          variation.commentary[currentMoveIndex + 1],
        );
        setCommentaryForNextMove(variation.commentary[currentMoveIndex + 1]);
      }
    });
  }, [currentVariationKey, currentMoveIndex]);

  /**
   * Rendering board & remaining + completed variations
   */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{selectedOpeningName}</Text>
        <Text style={styles.headerText}>Playing as {userColor}</Text>
      </View>
      <BoardView fen={openingData.startingFEN} color={userColor} />
      <View style={styles.linesList}>
        <Text style={{ color: 'black', marginBottom: 10 }}>Completed</Text>
        {completedVariations.length > 0 ? (
          completedVariations.map((line, index) => (
            <Text key={index} style={styles.headerText}>
              {line}
            </Text>
          ))
        ) : (
          <Text style={styles.headerText}>None</Text>
        )}
        <Text>----</Text>

        <Text style={{ color: 'black', marginBottom: 10 }}>Remaining</Text>
        {remainingVariations.map((variation, index) => (
          <Text key={index} style={styles.headerText}>
            {variation.name}
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
