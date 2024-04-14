import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import openingData from '../data/openingdb.json';
import {
  getAllVariationsByOpeningKey,
  getVariationByKey,
  useCurrentVariation,
} from '../state/selectors'; // Adjust the path to where your selectors are

import { Chess } from 'chess.js';
import Square from './Square';
import Piece from './Piece';

/**
 * Creating the board data
 */
const DIMENSION = 8;
const COLUMN_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const screenWidth = Dimensions.get('window').width - 32;

function findMoveByKeys(openingKey, variationKey) {
  // Find the opening by the given key
  const opening = openingData.openings.find(
    opening => opening.key === openingKey,
  );
  if (!opening) {
    console.log('Opening not found');
    return null;
  }

  // Find the variation within the found opening by the given variation key
  const variation = opening.variations.find(
    variation => variation.key === variationKey,
  );
  if (!variation) {
    console.log('Variation not found');
    return null;
  }

  // Return the moves array if the variation is found
  return variation.moves;
}

export const BoardView = ({ fen, color = 'BLACK' }) => {
  const dispatch = useDispatch();

  /**
   * Init
   */
  const [initialized, setInitialized] = useState(false);

  /**
   * Data
   */
  const currentOpeningKey = useSelector(
    state => state.currentPlay.selectedOpening,
  );
  const allVariationsInOpening = useSelector(state =>
    getAllVariationsByOpeningKey(state, currentOpeningKey),
  );
  const completedVariationsInOpening = useSelector(
    state => state.progress.completedVariations[currentOpeningKey],
  );

  /**
   * Currently playing
   */
  const currentVariation = useCurrentVariation();

  /**
   * Chess.JS & Board Layout
   */
  const [game, setGame] = useState(new Chess(fen));
  const [board, setBoard] = useState(null);
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });

  const offset = { x: -32, y: 70 };
  const onBoardLayout = event => {
    const layout = event.nativeEvent.layout;
    offset.x = layout.x;
    offset.y = layout.y;
    setBoardOffset({ x: layout.x, y: layout.y });
  };

  /**
   * Making moves
   */
  const [selectedSquare, setSelectedSquare] = useState(null);
  const piecesPosition = {};
  const [possibleMoves, setPossibleMoves] = useState([]);
  /**
   * Calculating Current Line & Move-History
   */
  // const [currentVariation, setCurrentVariation] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);

  /**
   * UTILITY
   * When the user has made a move, a random remaining variation of those not
   * yet completed should be chosen
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

    const randomIndex = Math.floor(
      Math.random() * remainingVariationsInOpening.length,
    );
    return remainingVariationsInOpening[randomIndex];
  };

  /**
   * DISPATCH
   * Set a variation to currentlyPlaying
   */
  const setCurrentVariation = variationToSet => {
    dispatch({
      type: 'currentPlay/setVariationAndMoveIndex',
      payload: {
        variationKey: variationToSet,
        openingKey: currentOpeningKey,
      },
    });
  };

  /**
   * DISPATCH
   * Mark a variation as COMPLETE
   */
  const completeLine = lineName => {
    // dispatch({
    //   type: 'progress/addCompletedVariation',
    //   // payload: { selectedOpening: currentOpeningName, variationKey: lineName },
    // });
    // alert('Completed a variation: ' + lineName);
  };

  /**
   * USEEFFECT
   * updating chess.js with new fen?
   */
  useEffect(() => {
    console.log('*** useEffect 01');
    console.log('Starting FEN: ', fen);
    setGame(new Chess(fen));
  }, [fen]);

  /**
   * USEEFFECT
   * I guess for rerendering the board only?
   */
  useEffect(() => {
    console.log('*** useEffect 03');
    console.log('Re-rendering Board');
    setBoard(createSquareRendering(game));
    setInitialized(true);
    //eslint-disable-next-line
  }, [game]);

  /**
   * USEEFFECT
   * Why actually not in initial render?
   */
  useEffect(() => {
    resetGame();
    console.log('*** useEffect 02');
    const foundVariation = findAndSelectVariation();
    console.log('New Variation after state update:', foundVariation.key);
    if (foundVariation) {
      setCurrentVariation(foundVariation);
    }
    //eslint-disable-next-line
  }, [currentOpeningKey]);

  /**
   * USEEFFECT
   * CPU makes a move
   */
  useEffect(() => {
    if (!currentVariation || !moveHistory) {
      return;
    }
    console.log('*** useEffect 04');
    console.log(
      'currentVariation, moveHistory useEffect',
      currentVariation,
      moveHistory,
    );
    if (game.turn() !== color && currentVariation) {
      console.log('gameTurn > cpu useEffect');
      makeCpuMove();
    }
    //eslint-disable-next-line
  }, [currentVariation, moveHistory]);

  // useEffect(() => {
  //   console.log('*** useEffect 05');
  //   console.log('Select a line at the beginning [] useEffect');
  //   if (color === 'b') {
  //     const newLine = findAndSelectVariation();
  //     if (newLine) {
  //       // setCurrentVariation(newLine);
  //       makeCpuMove();
  //     }
  //   }
  //   setTimeout(() => {
  //     setInitialized(true);
  //   }, 50);
  //   //eslint-disable-next-line
  // }, []);

  // useEffect(() => {
  //   console.log('*** useEffect 06');
  //   console.log(
  //     'Checking if a line is completed or not, currentLine, moveHistory.length',
  //   );
  //
  //   const isLineCompleted =
  //     currentVariation && !currentVariation.moves[moveHistory.length];
  //   if (isLineCompleted) {
  //     const completedVariation = currentVariation.key;
  //     console.log('currentVariation', currentVariation);
  //     console.log('completedVariation', completedVariation);
  //     completeLine(completedVariation);
  //
  //     /**
  //      * Refactor to make it move after accepting the alert
  //      */
  //     const newLine = findAndSelectVariation();
  //     console.log('Found a new line: ', newLine);
  //     if (newLine) {
  //       // resetGame();
  //       // setCurrentVariation(newLine);
  //       if (color === 'b') {
  //         console.log('CPU makes move');
  //         makeCpuMove();
  //       }
  //     }
  //   }
  //   //eslint-disable-next-line
  // }, [currentVariation, moveHistory.length]);

  /**
   * Function calls
   */
  const resetGame = () => {
    console.log('Reset Game – Call');
    const newGame = new Chess(fen);
    setGame(newGame);
    setMoveHistory([]);
    setCurrentVariation(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setBoard(createSquareRendering(newGame));
  };

  const validateUserMove = move => {
    console.log('validateUserMove');
    const newMoveHistory = [...moveHistory, move];
    console.log('allVariationsInOpening', allVariationsInOpening);
    console.log('completedVariationsInOpening', completedVariationsInOpening);

    console.log('validateUserMove');

    // Get full opening data based on the opening key
    const opening = openingData.openings.find(o => o.key === currentOpeningKey);
    if (!opening) {
      console.error('Opening not found');
      return;
    }

    // Fetch completion data from state or context where this function is used
    const completedVariationsInOpening = {}; // This should be fetched appropriately

    // Filter out completed variations
    const remainingVariations = opening.variations.filter(
      variation =>
        !(
          completedVariationsInOpening[variation.key] &&
          completedVariationsInOpening[variation.key].isCompleted
        ),
    );
    console.log('remainingVariations', remainingVariations);

    // Find the current variation by matching move history
    const currentVariation = remainingVariations.find(variation => {
      return moveHistory.every(
        (mhMove, index) => variation.moves && variation.moves[index] === mhMove,
      );
    });

    if (currentVariation) {
      console.log(
        'Current Line:',
        currentOpeningKey,
        currentVariation.variationKey,
      );
      dispatch({
        type: 'currentPlay/setVariation',
        payload: {
          variationKey: currentVariation.variationKey,
          moveIndex: moveHistory.length,
        },
      });
      const nextMoveIndex = newMoveHistory.length;
      const nextMove = currentVariation.moves[nextMoveIndex + 1];
      console.log(
        'Next Expected User-Move:',
        nextMove ? nextMove : 'End of scenario line',
      );

      // setCurrentVariation(currentVariation);
      setMoveHistory(newMoveHistory);
      return true;
    } else {
      console.log('No matching line found for the move sequence.');
      return false;
    }
  };

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

  const makeCpuMove = () => {
    console.log('makeCpuMove', currentVariation);
    const moves = findMoveByKeys(currentOpeningKey, currentVariation.key);
    console.log('moves', moves);
    if (currentVariation) {
      const nextMove = moves[moveHistory.length];

      if (nextMove) {
        console.log('CPU Move:', nextMove);
        setTimeout(() => {
          const moveResult = game.move(nextMove);
          if (moveResult) {
            console.log('gm?', currentVariation);
            dispatch({
              type: 'currentPlay/setVariation',
              payload: {
                variationKey: currentVariation.key,
                moveIndex: moveHistory.length,
              },
            });
            setGame(new Chess(game.fen()));
            setMoveHistory(prev => [...prev, nextMove]);
          } else {
            console.error('Invalid CPU move:', nextMove);
          }
        }, 400);
      }
    }
  };

  const createSquareRendering = gameInstance => {
    const squares = [];
    for (let i = 0; i < DIMENSION; i++) {
      const row = [];
      for (let j = 0; j < DIMENSION; j++) {
        const rank = color === 'w' ? DIMENSION - i : i + 1;
        const fileIndex = color === 'w' ? j : DIMENSION - 1 - j;
        const square = COLUMN_NAMES[fileIndex] + rank;
        const piece = gameInstance.get(square);
        let possibleMove = false;

        const isBlackSquare =
          (rank + fileIndex) % 2 === (color === 'w' ? 1 : 0);

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

  const getScreenCoordinates = square => {
    const file = square[0]; // e.g., 'a'
    const rank = parseInt(square[1], 10); // e.g., 1

    const fileIndex = COLUMN_NAMES.indexOf(file);
    const rankIndex = DIMENSION - rank;

    const x =
      color === 'w'
        ? fileIndex * (screenWidth / DIMENSION)
        : (DIMENSION - 1 - fileIndex) * (screenWidth / DIMENSION);
    const y =
      color === 'w'
        ? rankIndex * (screenWidth / DIMENSION)
        : (DIMENSION - 1 - rankIndex) * (screenWidth / DIMENSION);

    return { x, y };
  };

  const pie = () => {
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
    const pieces = pie();
    return <>{pieces}</>;
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
