import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import scenarios from '../data/scenarios.js';
import { useDispatch, useSelector } from 'react-redux';

import { Chess } from 'chess.js';
import Square from './Square';

const DIMENSION = 8;
const COLUMN_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const screenWidth = Dimensions.get('window').width - 32;

const currentScenarioName = state => state.currentPlay.scenario;

export const BoardView = ({ fen, color = 'b' }) => {
  const scenarioName = useSelector(currentScenarioName);
  const [game, setGame] = useState(new Chess(fen));
  const [_, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const scenarioLines = scenarios[scenarioName];
  const [currentLine, setCurrentLine] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);

  const dispatch = useDispatch();
  const completedLines = useSelector(
    state => state.progress.completedLines[scenarioName],
  );

  const completeLine = lineName => {
    dispatch({
      type: 'progress/addCompletedLine',
      payload: { scenario: scenarioName, line: lineName },
    });
    alert('Completed line: ' + lineName);
  };

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

  useEffect(() => {
    const newLine = selectRandomLine();
    console.log('New Line after state update:', newLine);
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
    console.log('Starting FEN: ', fen);
    setGame(new Chess(fen));
  }, [fen]);

  useEffect(() => {
    setBoard(createBoardData(game));
    //eslint-disable-next-line
  }, [game]);

  useEffect(() => {
    if (game.turn() !== color && currentLine) {
      makeCpuMove();
    }
    //eslint-disable-next-line
  }, [currentLine, moveHistory]);

  useEffect(() => {
    if (color === 'b') {
      const newLine = selectRandomLine();
      if (newLine) {
        setCurrentLine(newLine);
        makeCpuMove();
      }
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const isLineCompleted =
      currentLine && !currentLine.moves[moveHistory.length];
    if (isLineCompleted) {
      const completedLineName = currentLine.line;
      console.log('done: ', completedLineName);
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

  const resetGame = () => {
    const newGame = new Chess(fen);
    setGame(newGame);
    setMoveHistory([]);
    setCurrentLine(null);
    setSelectedSquare(null);
    setBoard(createBoardData(newGame));
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
    if (selectedSquare) {
      if (selectedSquare !== square) {
        try {
          const move = game.move({ from: selectedSquare, to: square });
          if (move) {
            if (validateUserMove(move.san)) {
              setGame(new Chess(game.fen()));
              setSelectedSquare(null);
            } else {
              throw new Error('Move does not follow the selected scenario.');
            }
          } else {
            throw new Error('Invalid move');
          }
        } catch (error) {
          alert(error.message);
          game.undo();
          setSelectedSquare(null);
        }
      } else {
        setSelectedSquare(null);
      }
    } else {
      if (game.get(square)) {
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
          setGame(new Chess(game.fen()));
          setMoveHistory(prev => [...prev, nextMove]);
        } else {
          console.error('Invalid CPU move:', nextMove);
        }
      }
    }
  };

  const createBoardData = gameInstance => {
    const squares = [];
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
          <Square
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
      squares.push(
        <View key={i} style={styles.row}>
          {row}
        </View>,
      );
    }
    return squares;
  };

  return <View style={styles.container}>{createBoardData(game)}</View>;
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
});
