import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import openingData from '../../data/openingdb.json';
import {
  useAllVariationsInOpening,
  useCompletedVariationsInOpening,
  useCurrentOpeningCompleted,
  useCurrentOpeningKey,
  useCurrentVariation,
  useCurrentVariationCompleted,
  usePlayerPlayingAs,
  useWhoseTurn,
} from '../../state/selectors'; // Adjust the path to where your selectors are
import { Chess } from 'chess.js';
import Square from './Square';
import Piece from './Piece';
import { useNavigation } from '@react-navigation/native';
import { findMoveByKeys } from '../../utils/findMoveByKeys';
import {
  resetCurrentPlay,
  setOpeningAsCompleted,
  setVariationAndMoveIndex,
  setVariationAsCompleted,
  setWhoseTurn,
} from '../../state/actions';

/**
 * Creating the board data
 */
const DIMENSION = 8;
const COLUMN_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const screenWidth = Dimensions.get('window').width - 32;

export const BoardView = ({ fen }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  /**
   * CONDITIONAL DISPATCHES
   */
  const dispatchVariationAndMoveIndex = (variationToSet, moveIndex) => {
    if (!variationToSet) {
      return;
    }

    dispatch(setVariationAndMoveIndex(variationToSet, moveIndex));
  };

  const dispatchResetCurrentPlay = () => {
    if (!variationIsCompleted) {
      return;
    }

    dispatch(resetCurrentPlay());
  };

  const dispatchCurrentWhoseTurn = newWhoseTurn => {
    if (!newWhoseTurn) {
      return;
    }

    dispatch(setWhoseTurn(newWhoseTurn));
  };

  /**
   * Init
   */
  const [initialized, setInitialized] = useState(false);

  /**
   * Data Selectors
   */
  const allVariationsInOpening = useAllVariationsInOpening();
  const completedVariationsInOpening = useCompletedVariationsInOpening();
  const variationIsCompleted = useCurrentVariationCompleted();
  const openingIsCompleted = useCurrentOpeningCompleted();

  /**
   * Currently playing selectors
   */
  const currentOpeningKey = useCurrentOpeningKey();
  const currentVariation = useCurrentVariation();
  const playerPlayingAs = usePlayerPlayingAs();
  const whoseTurn = useWhoseTurn();

  /**
   * Chess.JS & Board Layout
   */
  const [game, setGame] = useState(new Chess(fen));
  const [board, setBoard] = useState(null);
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });

  /**
   * Making moves
   */
  const piecesPosition = {};
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  /**
   * Local movehistory state
   */
  const [moveHistory, setMoveHistory] = useState([]);

  /**
   * ******* USEEFFECTS *******
   * Initialize App
   * Update Chess.JS
   * Rerender Board
   * On each move
   * When a variation is done
   */

  /**
   * Init
   */
  useEffect(() => {
    console.log('*** useEffect ***');
    console.log('*** INIT BOARD ***');
    if (playerPlayingAs === 'b') {
      const initialVariation = findAndSelectVariation();
      if (initialVariation) {
        dispatchVariationAndMoveIndex(initialVariation.key, moveHistory.length);
      }
    } else {
      // player playing white
    }
    setTimeout(() => {
      setInitialized(true);
    }, 50);
    //eslint-disable-next-line
  }, []);

  /**
   * Updating chess.js with new fen
   */
  useEffect(() => {
    console.log('*** useEffect 01');
    console.log('Starting FEN: ', fen);
    setGame(new Chess(fen));
  }, [fen]);

  /**
   * Rerender the board
   */
  useEffect(() => {
    console.log('*** Re-rendering Board ***');
    setBoard(createSquareRendering(game));
    //eslint-disable-next-line
  }, [game]);

  /**
   * On each move & The first start
   */
  useEffect(() => {
    if (!currentVariation || !moveHistory || !whoseTurn) {
      return;
    }
    console.log('*** WHOSETURN useEffect ***');
    const moves = findMoveByKeys(currentOpeningKey, currentVariation);
    console.log(
      'Checking if a line is completed or not, moves.length, moveHistory.length,currentVariation',
      moves.length,
      moveHistory.length,
      currentVariation,
    );

    const variationComplete = moves.length === moveHistory.length;

    if (variationComplete) {
      dispatch(setVariationAsCompleted(currentVariation, currentOpeningKey));
      return;
    }

    console.log('*** useEffect continues ***');
    console.log('whoseTurn?', whoseTurn);
    if (whoseTurn !== 'cpu') {
      return;
    }

    console.log('*** CPU DECISION ***');
    console.log('currentVariation, moveHistory', currentVariation, moveHistory);

    // Artificial Delay for CPU moves
    setTimeout(() => {
      makeCpuMove();
    }, 1);

    //eslint-disable-next-line
  }, [whoseTurn, currentVariation]);

  /**
   * After completing a variation (via currentPlayReducer)
   */
  useEffect(() => {
    if (!variationIsCompleted) {
      return;
    }
    console.log('*** useEffect ***');
    console.log('*** Variation done! ***', currentVariation);

    const opening = openingData.openings.find(o => o.key === currentOpeningKey);
    if (!opening) {
      console.error('Opening not found');
      return;
    }

    const remainingVariations = opening.variations.filter(
      variation =>
        !(
          completedVariationsInOpening[variation.key] &&
          completedVariationsInOpening[variation.key].isCompleted
        ),
    );

    if (remainingVariations.length === 0) {
      dispatch(setOpeningAsCompleted(currentOpeningKey));
      return;
    }

    console.log('*** useEffect continues ***');
    Alert.alert('Variation Done!', currentVariation, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Next variation',
        onPress: () => {
          resetGame();
        },
      },
    ]);
    //eslint-disable-next-line
  }, [variationIsCompleted]);

  /**
   * After completing an opening (via currentPlayReducer)
   */
  useEffect(() => {
    if (!openingIsCompleted) {
      return;
    }
    console.log('*** useEffect ***');
    console.log('*** Opening done! ***', currentOpeningKey);
    Alert.alert('Opening Done!', currentOpeningKey, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Back to openings',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
    //eslint-disable-next-line
  }, [openingIsCompleted]);

  /**
   * FUNCTIONS
   */

  /**
   * After reset and initial launch, find a random variation
   */
  const findAndSelectVariation = () => {
    console.log('allVariationsInOpening', allVariationsInOpening);
    console.log('completedVariationsInOpening', completedVariationsInOpening);
    const remainingVariationsInOpening = allVariationsInOpening.filter(
      variation =>
        !(
          completedVariationsInOpening &&
          completedVariationsInOpening[variation.key] &&
          completedVariationsInOpening[variation.key].isCompleted
        ),
    );
    console.log('remaining variations', remainingVariationsInOpening);

    if (remainingVariationsInOpening.length === 0) {
      setOpeningAsCompleted();
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * remainingVariationsInOpening.length,
    );
    return remainingVariationsInOpening[randomIndex];
  };

  /**
   * CPU makes a move
   */
  const makeCpuMove = () => {
    console.log('makeCpuMove in current variation:', currentVariation);

    const moves = findMoveByKeys(currentOpeningKey, currentVariation);

    if (currentVariation) {
      const nextMove = moves[moveHistory.length];

      if (nextMove) {
        console.log('CPU next Move:', nextMove);
        const moveResult = game.move(nextMove);
        if (moveResult) {
          setGame(new Chess(game.fen()));
          setMoveHistory(prev => [...prev, nextMove]);
          dispatchVariationAndMoveIndex(
            currentVariation,
            moveHistory.length + 1,
          );
          dispatchCurrentWhoseTurn('player');
        } else {
          console.error('Invalid CPU move:', nextMove);
        }
      }
    }
  };

  /**
   * Validate a user move
   */
  const validateUserMove = move => {
    console.log('validateUserMove, user played: ', move);
    console.log('moveHistory: ', moveHistory); // Should log the updated move history

    const newMoveHistory = [...moveHistory, move]; // Includes the new move
    console.log('newMoveHistory: ', newMoveHistory); // Should log the updated move history

    const opening = openingData.openings.find(o => o.key === currentOpeningKey);
    if (!opening) {
      console.error('Opening not found');
      return;
    }

    const remainingVariations = opening.variations.filter(
      variation =>
        !(
          completedVariationsInOpening[variation.key] &&
          completedVariationsInOpening[variation.key].isCompleted
        ),
    );

    // Find the current variation by matching the new move history
    const foundVariation = remainingVariations.find(variation => {
      return newMoveHistory.every((mhMove, index) => {
        return (
          index < variation.moves.length && variation.moves[index] === mhMove
        );
      });
    });

    if (foundVariation) {
      console.log('Current Line:', currentOpeningKey, foundVariation.key);
      const nextMoveIndex = newMoveHistory.length + 1;
      const nextMove = foundVariation.moves[nextMoveIndex]; // Adjusted to fetch the next expected move
      console.log(
        'Next Expected User-Move:',
        nextMove ? nextMove : 'End of scenario line',
      );

      dispatchVariationAndMoveIndex(foundVariation.key, nextMoveIndex - 1);
      setMoveHistory(newMoveHistory);
      dispatchCurrentWhoseTurn('cpu');
      return true;
    } else {
      console.log('No matching line found for the move sequence.');
      return false;
    }
  };

  /**
   * Reset Game
   */
  const resetGame = () => {
    console.log('Reset Game – Call');
    setInitialized(false);
    setMoveHistory([]);
    const newGame = new Chess(fen);
    setGame(newGame);
    dispatchResetCurrentPlay();
    if (playerPlayingAs === 'b') {
      const newVariation = findAndSelectVariation();
      if (newVariation) {
        dispatchVariationAndMoveIndex(newVariation.key, moveHistory.length);
      }
      dispatchCurrentWhoseTurn('cpu');
    } else {
      // player is white
      dispatchCurrentWhoseTurn('player');
    }
    setSelectedSquare(null);
    setPossibleMoves([]);
    setTimeout(() => {
      setInitialized(true);
    }, 500);
  };

  /**
   * RENDERING & BOARD UI
   */

  const handleSquarePress = square => {
    let move = null;
    if (selectedSquare) {
      if (selectedSquare !== square) {
        try {
          move = game.move({ from: selectedSquare, to: square });
        } catch (e) {
          console.log('Invalid move!');
        }
        if (move) {
          if (validateUserMove(move.san)) {
            setGame(new Chess(game.fen()));
            setPossibleMoves([]);
            setSelectedSquare(null);
          } else {
            Alert.alert(
              'Try something different',
              selectedSquare +
                ' to ' +
                square +
                ' is not part of this opening! Click HELP to get a guess.',
            );
            game.undo();
            setPossibleMoves([]);
            setSelectedSquare(null);
          }
        } else {
          game.undo();
          setPossibleMoves([]);
          setSelectedSquare(null);
        }
      } else {
        setPossibleMoves([]);
        setSelectedSquare(null);
      }
    } else {
      if (game.get(square)) {
        const possibleMoves = game
          .moves({
            square: square,
            verbose: true,
          })
          .map(item => item.to);

        setPossibleMoves(possibleMoves);
        setSelectedSquare(square);
      }
    }
  };

  const createSquareRendering = gameInstance => {
    const squares = [];
    for (let i = 0; i < DIMENSION; i++) {
      const row = [];
      for (let j = 0; j < DIMENSION; j++) {
        const rank = playerPlayingAs === 'w' ? DIMENSION - i : i + 1;
        const fileIndex = playerPlayingAs === 'w' ? j : DIMENSION - 1 - j;
        const square = COLUMN_NAMES[fileIndex] + rank;
        const piece = gameInstance.get(square);
        let possibleMove = false;

        const isBlackSquare =
          (rank + fileIndex) % 2 === (playerPlayingAs === 'w' ? 1 : 0);

        if (piece) {
          piecesPosition[square] = piece;
        }

        if (possibleMoves.includes(square, 0) && !piece) {
          possibleMove = true;
        }

        row.push(
          <Square
            // handlePieceDrop={handlePieceDrop}
            key={square}
            possibleMove={possibleMove}
            size={screenWidth / DIMENSION}
            piece={piece}
            square={square}
            isBlackSquare={isBlackSquare}
            handleSquarePress={handleSquarePress}
            isSelected={square === selectedSquare}
          />,
        );
      }
      squares.push(
        <View key={'square_' + i} style={styles.row}>
          {row}
        </View>,
      );
    }
    return squares;
  };

  const PieceComponent = () => {
    return Object.entries(piecesPosition).map(([square, piece]) => {
      const { x, y } = getScreenCoordinates(square);

      return (
        <Piece
          // handlePieceDrop={handlePieceDrop}
          key={square}
          size={screenWidth / DIMENSION}
          top={y}
          left={x}
          piece={piece}
          square={square}
          handleSquarePress={handleSquarePress}
          isSelected={square === selectedSquare}
          pieceType={piece.type}
          color={piece.color}
        />
      );
    });
  };

  const createPieceRendering = gameInstance => {
    const pieces = PieceComponent();
    return <>{pieces}</>;
  };

  /**
   * RN Utilities to offset board to screensize
   */
  const offset = { x: -32, y: 70 };
  const onBoardLayout = event => {
    const layout = event.nativeEvent.layout;
    offset.x = layout.x;
    offset.y = layout.y;
    setBoardOffset({ x: layout.x, y: layout.y });
  };

  const getScreenCoordinates = square => {
    const file = square[0]; // e.g., 'a'
    const rank = parseInt(square[1], 10); // e.g., 1

    const fileIndex = COLUMN_NAMES.indexOf(file);
    const rankIndex = DIMENSION - rank;

    const x =
      playerPlayingAs === 'w'
        ? fileIndex * (screenWidth / DIMENSION)
        : (DIMENSION - 1 - fileIndex) * (screenWidth / DIMENSION);
    const y =
      playerPlayingAs === 'w'
        ? rankIndex * (screenWidth / DIMENSION)
        : (DIMENSION - 1 - rankIndex) * (screenWidth / DIMENSION);

    return { x, y };
  };

  if (!initialized) {
    return (
      <View style={{ height: '50%', justifyContent: 'center' }}>
        <Text>Loading</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container} onLayout={onBoardLayout}>
        {createSquareRendering(game)}
        <View style={{ position: 'absolute' }}>
          {createPieceRendering(game)}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column' },
  row: { flexDirection: 'row', zIndex: -1 },
});
