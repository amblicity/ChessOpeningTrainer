import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PIECE_IMAGES = {
  b: {
    w: require('./pieces/wB.png'),
    b: require('./pieces/bB.png'),
  },
  k: {
    w: require('./pieces/wK.png'),
    b: require('./pieces/bK.png'),
  },
  n: {
    w: require('./pieces/wN.png'),
    b: require('./pieces/bN.png'),
  },
  p: {
    w: require('./pieces/wP.png'),
    b: require('./pieces/bP.png'),
  },
  q: {
    w: require('./pieces/wQ.png'),
    b: require('./pieces/bQ.png'),
  },
  r: {
    w: require('./pieces/wR.png'),
    b: require('./pieces/bR.png'),
  },
};

const Square = ({
  size,
  piece,
  isBlackSquare,
  square,
  handleSquarePress,
  isSelected,
}) => {
  const pieceImage = piece ? PIECE_IMAGES[piece.type][piece.color] : null;
  const squareStyle = isBlackSquare ? styles.blackSquare : styles.whiteSquare;

  // Style for the selected piece
  const selectedStyle = isSelected ? styles.selected : {};

  return (
    <TouchableOpacity
      onPress={() => handleSquarePress(square)}
      style={[styles.square, squareStyle, { width: size, height: size }]}>
      {pieceImage && (
        <Image
          source={pieceImage}
          resizeMode="contain"
          style={[styles.piece, selectedStyle]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: { alignItems: 'center', justifyContent: 'center' },
  piece: { width: '80%', height: '80%' },
  blackSquare: { backgroundColor: 'grey' },
  whiteSquare: { backgroundColor: 'white' },
  selected: {
    transform: [{ scale: 1.25 }], // Example: scale up the piece
    // borderColor: 'red',
    // borderWidth: 2,
  },
});

export default Square;
