import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const PIECE_IMAGES = {
  b: {
    w: require('../../assets/pieces/wB.png'),
    b: require('../../assets/pieces/bB.png'),
  },
  k: {
    w: require('../../assets/pieces/wK.png'),
    b: require('../../assets/pieces/bK.png'),
  },
  n: {
    w: require('../../assets/pieces/wN.png'),
    b: require('../../assets/pieces/bN.png'),
  },
  p: {
    w: require('../../assets/pieces/wP.png'),
    b: require('../../assets/pieces/bP.png'),
  },
  q: {
    w: require('../../assets/pieces/wQ.png'),
    b: require('../../assets/pieces/bQ.png'),
  },
  r: {
    w: require('../../assets/pieces/wR.png'),
    b: require('../../assets/pieces/bR.png'),
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
    transform: [{ scale: 1.25 }],
  },
});

export default Square;
