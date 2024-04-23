import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BoardView } from '../chessboard/BoardView';

import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import {
  getAllVariationsByOpeningKey,
  getMovesByOpeningAndVariationKey,
  usePlayerPlayingAs,
} from '../../state/selectors';

/**
 * This is known from the previous screen
 */
const currentlySelectedOpening = state => state.currentPlay.selectedOpening;
const startingPosititon = state => state.currentPlay.startingPosition;

export const CurrentPlayView = () => {
  /**
   * This state is used for the ? Button at top right
   */
  const [showHelp, setShowHelp] = useState(false);
  const [commentaryForNextMove, setCommentaryForNextMove] = useState('');

  /**
   * React Native Navigation System
   */
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setShowHelp(c => !c)} title={'Help'} />
      ),
    });
  }, [navigation]);

  const selectedOpeningName = useSelector(currentlySelectedOpening);
  const startingPositionFEN = useSelector(startingPosititon);
  const playerPlayingAs = usePlayerPlayingAs();

  const allVariationsInOpening = useSelector(state =>
    getAllVariationsByOpeningKey(state, 'CaroKann'),
  );

  // console.log('allVariationsInOpening', allVariationsInOpening);

  // const completedVariations = useSelector(state =>
  //   getCompletedVariationsByOpeningKey(state, 'CaroKann'),
  // );

  // console.log('completedVariations', completedVariations);

  const movesInVariation = useSelector(state =>
    getMovesByOpeningAndVariationKey(state, 'CaroKann', 'QICK'),
  );

  // console.log('moves in variation', movesInVariation);

  // const remainingVariations = allVariationsInOpening.filter(
  //   variation => !completedVariations.includes(variation.key),
  // );

  // console.log('remainingVariations', remainingVariations);

  const currentVariationKey = useSelector(
    state => state.currentPlay.variationKey,
  );
  // console.log('currentVariation', currentVariationKey);
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

  // const image = require('../../../assets/img/board-bg-01.jpg'

  /**
   * Rendering board & remaining + completed variations
   */
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/img/board-bg-01.jpg')}
        style={{
          width: '100%',
          height: '125%',
          position: 'absolute',
          top: 0,
        }}
        resizeMode={'stretch'}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>{selectedOpeningName}</Text>
        <Text style={styles.headerText}>Playing as {playerPlayingAs}</Text>
      </View>
      <View style={{ opacity: 1, marginTop: 28 }}>
        <BoardView fen={startingPositionFEN} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F4EAE2',
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
