import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

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
  handlePieceDrop,
}) => {
  const pieceImage = piece ? PIECE_IMAGES[piece.type][piece.color] : null;
  const squareStyle = isBlackSquare ? styles.blackSquare : styles.whiteSquare;

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
    <Animated.View
      style={[
        styles.square,
        squareStyle,
        {
          width: size,
          height: size,
          zIndex: 500,
          elevation: 4,
        },
      ]}>
      {pieceImage && (
        <Animated.View
          style={{
            zIndex: 10,
            elevation: 5,
            backgroundColor: 'red',
            position: 'absolute',
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          }}
          {...panResponder.panHandlers}
          useNativeDriver={true}>
          <Animated.Image
            source={pieceImage}
            style={{
              zIndex: 10,
              position: 'absolute',
              width: 40,
              height: 40,
            }}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  square: { zIndex: -1 },
  piece: { width: '80%', height: '80%' },
  blackSquare: { backgroundColor: 'grey' },
  whiteSquare: { backgroundColor: 'white' },
  selected: {
    zIndex: 100,
    position: 'absolute',
    transform: [{ scale: 1.25 }],
  },
});

export default Square;
