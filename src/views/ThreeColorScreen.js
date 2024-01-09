import React, { useRef } from 'react';
import { View, Animated, Dimensions, Text, StyleSheet } from 'react-native';

const SwipeableImageSwitcher = () => {
  const windowWidth = Dimensions.get('window').width;
  const scrollX = useRef(new Animated.Value(0)).current; // Track scroll position

  // Interpolate scroll position to opacity for the second (incoming) image
  const secondImageOpacity = scrollX.interpolate({
    inputRange: [0, windowWidth * 0.5, windowWidth],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const thirdImageOpacity = scrollX.interpolate({
    inputRange: [windowWidth, windowWidth * 1.5, windowWidth * 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  return (
    <View style={styles.container}>
      {/* Image container */}
      <View style={styles.fixed}>
        <Animated.Image
          source={require('../../assets/test.jpg')} // First image
          style={styles.image} // First image always fully visible
        />
        <Animated.Image
          source={require('../../assets/test2.jpg')} // Second image
          style={[styles.image, { opacity: secondImageOpacity }]} // Only second image's opacity animated
        />
        <Animated.Image
          source={require('../../assets/test3.jpg')} // Third image
          style={[styles.image, { opacity: thirdImageOpacity }]} // Only third image's opacity animated
        />
      </View>

      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}>
        <View style={{ width: windowWidth, justifyContent: 'center' }}>
          <Text style={styles.text}>Playing as White</Text>
        </View>
        <View style={{ width: windowWidth, justifyContent: 'center' }}>
          <Text style={styles.text}>Playing as Black</Text>
        </View>
        <View style={{ width: windowWidth, justifyContent: 'center' }}>
          <Text style={styles.text}>Third Image Text</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixed: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  text: {
    fontSize: 24,
    color: 'red',
    position: 'absolute',
    top: 50,
    left: 20,
  },
});

export default SwipeableImageSwitcher;
