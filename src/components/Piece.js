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

const Piece = ({
  piece,
  top,
  left,
  square,
  handleSquarePress,
  isSelected,
  handlePieceDrop,
}) => {
  const pieceImage = piece ? PIECE_IMAGES[piece.type][piece.color] : null;
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        handlePieceDrop(gestureState);
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={{
        top: 0,
        left: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
      {...panResponder.panHandlers}
      useNativeDriver={true}>
      <TouchableOpacity
        onPress={() => {
          handleSquarePress(square);
        }}>
        <Animated.Image
          source={pieceImage}
          style={[
            {
              position: 'absolute',
              top: top + 1,
              left: left + 2,
              width: 40,
              height: 40,
            },
            isSelected && styles.selected,
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  piece: { width: '80%', height: '80%' },
  selected: {
    transform: [{ scale: 1.15 }, { rotate: '0deg' }],
  },
});

export default Piece;
