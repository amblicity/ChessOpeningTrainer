import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import openingData from '../data/openingdb.json';

import { Chess } from 'chess.js';
import Square from './Square';
import Piece from './Piece';

const DIMENSION = 8;
const COLUMN_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const screenWidth = Dimensions.get('window').width - 32;

const currentScenarioName = state => state.currentPlay.scenario;

export const BoardView = ({ fen, color = 'b' }) => {
  const dispatch = useDispatch();

  /**
   * Init
   */
  const [initialized, setInitialized] = useState(false);

  /**
   * Data
   */
  const openings = openingData.openings;
  const scenarioName = useSelector(currentScenarioName);

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
  const scenarioLines =
    openings.find(opening => opening.key === scenarioName)?.variations || [];
  const [currentLine, setCurrentLine] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const completedLines = useSelector(
    state => state.progress.completedLines[scenarioName],
  );

  useEffect(() => {
    console.log('Starting FEN: ', fen);
    setGame(new Chess(fen));
  }, [fen]);

  const selectRandomLine = () => {
    const remainingLines = scenarioLines.filter(
      line => !completedLines.includes(line.line),
    );

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
      type: 'progress/addCompletedLine',
      payload: { scenario: scenarioName, line: lineName },
    });
    alert('Completed line: ' + lineName);
  };

  /**
   * After opening has changed
   */
  useEffect(() => {
    const newLine = selectRandomLine();
    console.log('New Variation after state update:', newLine);
    if (newLine) {
      setCurrentLine(newLine);
      resetGame();
      if (color === 'b') {
        makeCpuMove();
      }
    }
    //eslint-disable-next-line
  }, [scenarioName]);

  useEffect(() => {
    console.log('CreateBoardData useEffect');
    setBoard(createSquareRendering(game));
    //eslint-disable-next-line
  }, [game]);

  useEffect(() => {
    console.log('CPU needs to make move? useEffect');
    if (game.turn() !== color && currentLine) {
      makeCpuMove();
    }
    //eslint-disable-next-line
  }, [currentLine, moveHistory]);

  useEffect(() => {
    console.log('Select a line at the beginning useEffect');
    if (color === 'b') {
      const newLine = selectRandomLine();
      if (newLine) {
        setCurrentLine(newLine);
        makeCpuMove();
      }
    }
    setInitialized(true);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log('Checking if a line is completed or not');

    const isLineCompleted =
      currentLine && !currentLine.moves[moveHistory.length];
    if (isLineCompleted) {
      const completedLineName = currentLine.line;
      completeLine(completedLineName);
      const newLine = selectRandomLine();
      if (newLine) {
        setCurrentLine(newLine);
        resetGame();
        if (color === 'b') {
          makeCpuMove();
        }
      }
    }
    //eslint-disable-next-line
  }, [currentLine, moveHistory.length]);

  /**
   * Function calls
   */
  const resetGame = () => {
    console.log('Reset Game – Call');
    const newGame = new Chess(fen);
    setGame(newGame);
    setMoveHistory([]);
    setCurrentLine(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setBoard(createSquareRendering(newGame));
  };

  const validateUserMove = move => {
    const newMoveHistory = [...moveHistory, move];
    const remainingLines = scenarioLines.filter(
      line => !completedLines.includes(line.line),
    );

    const matchedLine = remainingLines.find(line => {
      return newMoveHistory.every(
        (mhMove, index) => line.moves[index] === mhMove,
      );
    });

    if (matchedLine) {
      console.log('Current Line:', scenarioName, matchedLine.line);
      dispatch({
        type: 'currentPlay/setLine',
        payload: { line: matchedLine.line, moveIndex: moveHistory.length },
      });
      const nextMoveIndex = newMoveHistory.length;
      const nextMove = matchedLine.moves[nextMoveIndex + 1];
      console.log(
        'Next Expected User-Move:',
        nextMove ? nextMove : 'End of scenario line',
      );

      setCurrentLine(matchedLine);
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
    if (currentLine) {
      const nextMove = currentLine.moves[moveHistory.length];

      if (nextMove) {
        console.log('CPU Move:', nextMove);
        const moveResult = game.move(nextMove);
        if (moveResult) {
          dispatch({
            type: 'currentPlay/setLine',
            payload: { line: currentLine.line, moveIndex: moveHistory.length },
          });
          setGame(new Chess(game.fen()));
          setMoveHistory(prev => [...prev, nextMove]);
        } else {
          console.error('Invalid CPU move:', nextMove);
        }
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
    const file = square[0]; // e.g., 'A'
    const rank = parseInt(square[1], 10); // e.g., 1

    const fileIndex = COLUMN_NAMES.indexOf(file);
    const rankIndex = DIMENSION - rank;

    const x = fileIndex * (screenWidth / DIMENSION);
    const y = rankIndex * (screenWidth / DIMENSION);

    return { x, y };
  };

  const pie = () => {
    return Object.entries(piecesPosition).map(([square, piece]) => {
      const { x, y } = getScreenCoordinates(square);

      // console.log('mapping pieces');
      // console.log('square', square);
      // console.log('piece', piece);
      // console.log('x,y', x, y);

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
    return <View>{pieces}</View>;
    return;

    for (let i = 0; i < DIMENSION; i++) {
      const row = [];
      for (let j = 0; j < DIMENSION; j++) {
        const rank = color === 'w' ? DIMENSION - i : i + 1;
        const fileIndex = color === 'w' ? j : DIMENSION - 1 - j;
        const square = COLUMN_NAMES[fileIndex] + rank;
        const piece = gameInstance.get(square);

        const isBlackSquare =
          (rank + fileIndex) % 2 === (color === 'w' ? 1 : 0);
        row.push(
          <Piece
            handlePieceDrop={handlePieceDrop}
            key={square}
            size={screenWidth / DIMENSION}
            piece={piece}
            square={square}
            isBlackSquare={isBlackSquare}
            handleSquarePress={handleSquarePress}
            isSelected={square === selectedSquare}
          />,
        );
      }
      pieces.push(
        <View
          key={'piece_' + i}
          style={[styles.row, { position: 'absolute', top: i * 42, left: 0 }]}>
          {row}
        </View>,
      );
    }
    return pieces;
  };

  if (!initialized) {
    return (
      <View>
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
