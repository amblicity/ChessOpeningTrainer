import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const PIECE_IMAGES = {
  b: {
    w: require('../../../assets/pieces/wB.png'),
    b: require('../../../assets/pieces/bB.png'),
  },
  k: {
    w: require('../../../assets/pieces/wK.png'),
    b: require('../../../assets/pieces/bK.png'),
  },
  n: {
    w: require('../../../assets/pieces/wN.png'),
    b: require('../../../assets/pieces/bN.png'),
  },
  p: {
    w: require('../../../assets/pieces/wP.png'),
    b: require('../../../assets/pieces/bP.png'),
  },
  q: {
    w: require('../../../assets/pieces/wQ.png'),
    b: require('../../../assets/pieces/bQ.png'),
  },
  r: {
    w: require('../../../assets/pieces/wR.png'),
    b: require('../../../assets/pieces/bR.png'),
  },
};

const Square = ({
  size,
  piece,
  isBlackSquare,
  square,
  handleSquarePress,
  isSelected,
  handlePieceDrop,
  possibleMove,
}) => {
  const squareStyle = isBlackSquare ? styles.blackSquare : styles.whiteSquare;
  const possibleMoveStyle = possibleMove && styles.possibleMoveSquare;

  const selectedStyle = isSelected ? styles.selected : {};

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('gesture', gestureState);
        handlePieceDrop(gestureState);
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 500,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <TouchableOpacity
      onPress={() => {
        handleSquarePress(square);
      }}
      style={[
        styles.square,
        squareStyle,
        {
          width: size,
          height: size,
        },
      ]}>
      {possibleMoveStyle && (
        <View
          style={{
            backgroundColor: 'black',
            opacity: 0.1,
            width: 20,
            height: 20,
            borderRadius: 20,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    zIndex: -1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piece: { width: '80%', height: '80%' },
  blackSquare: { backgroundColor: 'grey', opacity: 0 },
  whiteSquare: { backgroundColor: 'white', opacity: 0 },
  possibleMoveSquare: { backgroundColor: 'red' },
  selected: {
    zIndex: 100,
    position: 'absolute',
    transform: [{ scale: 1.25 }],
  },
});

export default Square;
