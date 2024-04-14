import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import openingData from '../data/openingdb.json';

import { Chess } from 'chess.js';
import Square from './Square';
import Piece from './Piece';

/**
 * Creating the board data
 */
const DIMENSION = 8;
const COLUMN_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const screenWidth = Dimensions.get('window').width - 32;

/**
 * The user has chosen an opening to learn
 */
const currentlySelectedOpening = state => state.currentPlay.selectedOpening;

export const BoardView = ({ fen, color = 'b' }) => {
  const dispatch = useDispatch();
  console.log(fen);

  /**
   * Init
   */
  const [initialized, setInitialized] = useState(false);

  /**
   * Data
   */
  const openings = openingData.openings;
  const currentOpeningName = useSelector(currentlySelectedOpening);
  // console.log('currentOpeningName', currentOpeningName);

  /**
   * Chess.JS & Board Layout
   */
  const [game, setGame] = useState(new Chess(fen));
  const [board, setBoard] = useState(null);
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });

  const offset = { x: -32, y: 70 };
  const onBoardLayout = event => {
    console.log('onBoardLayout', event.nativeEvent.layout);
    const layout = event.nativeEvent.layout;
    offset.x = layout.x;
    offset.y = layout.y;
    console.log('layout', layout);
    setBoardOffset({ x: layout.x, y: layout.y });
  };

  /**
   * Making moves
   */
  const [selectedSquare, setSelectedSquare] = useState(null);
  const piecesPosition = {};
  const [possibleMoves, setPossibleMoves] = useState([]);

  const handlePieceDrop = gestureState => {
    return;
    console.log('boardOffset', offset);
    console.log('gestureState', gestureState);
    const squareSize = (screenWidth - 39) / 8;
    console.log('squareSize', squareSize);
    const offX = 40;
    const offY = 120;
    const adjustedTargetX = gestureState.moveX - 32;
    const adjustedTargetY = gestureState.moveY - 140;
    const adjustedSourceX = gestureState.x0 - 32;
    const adjustedSourceY = gestureState.y0 - 140;

    const targetFile = Math.floor(adjustedTargetX / squareSize);
    const targetRank = 7 - Math.floor(adjustedTargetY / squareSize);
    const sourceFile = Math.floor(adjustedSourceX / squareSize);
    console.log('file: adjustedSourceX / squareSize', sourceFile);
    const sourceRank = 7 - Math.floor(adjustedSourceY / squareSize);
    console.log('rank: adjustedSourceY / squareSize', 7 - sourceRank);

    const targetSquare = `${COLUMN_NAMES[targetFile]}${targetRank + 1}`;
    const sourceSquare = `${COLUMN_NAMES[sourceFile]}${sourceRank + 1}`;
    // alert(sourceSquare + ' to ' + targetSquare);
    try {
      console.log('moving, from: ' + sourceSquare + ' to ' + targetSquare);
      const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }; // Include promotion if needed
      if (game.move(move)) {
        // alert('valid move');
        console.log('Valid move');
        setGame(new Chess(game.fen()));
        // Update the game state here
      } else {
        // alert('invalid move');
        game.undo();
        console.log('Invalid move');
        // Handle invalid move (e.g., revert piece position)
      }
    } catch (e) {
      // alert(e);
      return;
    }
  };

  /**
   * Calculating Current Line & Move-History
   */
  const allVariationsInOpening =
    openings.find(opening => opening.key === currentOpeningName)?.variations ||
    [];
  // console.log('allVariationsInOpening', allVariationsInOpening);
  const [currentVariation, setCurrentVariation] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const completedVariations = useSelector(
    state => state.progress.completedVariations[currentOpeningName],
  );

  useEffect(() => {
    console.log('*** useEffect 01');
    console.log('Starting FEN: ', fen);
    setGame(new Chess(fen));
  }, [fen]);

  const selectRandomLine = () => {
    console.log('selectRandomLine()');
    const remainingLines = allVariationsInOpening.filter(
      variation => !completedVariations.includes(variation.variationKey),
    );
    console.log('remaining lines', remainingLines);

    if (remainingLines.length === 0) {
      alert('All lines in this scenario are completed!');
      return null;
    }

    const randomIndex = Math.floor(Math.random() * remainingLines.length);
    return remainingLines[randomIndex];
  };

  /**
   * Mark a variation as COMPLETE
   */
  const completeLine = lineName => {
    dispatch({
      type: 'progress/addCompletedVariation',
      payload: { selectedOpening: currentOpeningName, variationKey: lineName },
    });
    alert('Completed a variation: ' + lineName);
  };

  /**
   * After opening has changed
   */
  useEffect(() => {
    console.log('*** useEffect 02');
    console.log('scenarioName useEffect', currentOpeningName);
    const newLine = selectRandomLine();
    console.log('New Variation after state update:', newLine);
    if (newLine) {
      setCurrentVariation(newLine);
      resetGame();
      if (color === 'b') {
        makeCpuMove();
      }
    }
    //eslint-disable-next-line
  }, [currentOpeningName]);

  useEffect(() => {
    // console.log('*** useEffect 03');
    console.log('Re-rendering Board');
    setBoard(createSquareRendering(game));
    //eslint-disable-next-line
  }, [game]);

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

  useEffect(() => {
    console.log('*** useEffect 05');
    console.log('Select a line at the beginning [] useEffect');
    if (color === 'b') {
      const newLine = selectRandomLine();
      if (newLine) {
        setCurrentVariation(newLine);
        makeCpuMove();
      }
    }
    setTimeout(() => {
      setInitialized(true);
    }, 50);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log('*** useEffect 06');
    console.log(
      'Checking if a line is completed or not, currentLine, moveHistory.length',
    );

    const isLineCompleted =
      currentVariation && !currentVariation.moves[moveHistory.length];
    if (isLineCompleted) {
      const completedVariation = currentVariation.key;
      console.log('currentVariation', currentVariation);
      console.log('completedVariation', completedVariation);
      completeLine(completedVariation);

      /**
       * Refactor to make it move after accepting the alert
       */
      const newLine = selectRandomLine();
      console.log('Found a new line: ', newLine);
      if (newLine) {
        resetGame();
        setCurrentVariation(newLine);
        if (color === 'b') {
          console.log('CPU makes move');
          makeCpuMove();
        }
      }
    }
    //eslint-disable-next-line
  }, [currentVariation, moveHistory.length]);

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
    const remainingVariations = allVariationsInOpening.filter(
      line => !completedVariations.includes(line.variationKey),
    );

    const currentVariation = remainingVariations.find(line => {
      return newMoveHistory.every(
        (mhMove, index) => line.moves[index] === mhMove,
      );
    });

    if (currentVariation) {
      console.log(
        'Current Line:',
        currentOpeningName,
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

      setCurrentVariation(currentVariation);
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
    if (currentVariation) {
      const nextMove = currentVariation.moves[moveHistory.length];

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
            handlePieceDrop={handlePieceDrop}
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
          handlePieceDrop={handlePieceDrop}
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
