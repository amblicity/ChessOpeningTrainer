import React, { useRef } from 'react';
import {
  View,
  Animated,
  Dimensions,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const SwipeableImageSwitcher = () => {
  const windowWidth = Dimensions.get('window').width;
  const scrollX = useRef(new Animated.Value(0)).current; // Track scroll position

  // Interpolate scroll position to opacity for the second (incoming) image
  const secondImageOpacity = scrollX.interpolate({
    inputRange: [0, windowWidth * 0.5, windowWidth],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Image container */}
      <View style={styles.fixed}>
        <Animated.Image
          source={require('../../assets/play-as-white.jpg')}
          style={styles.image}
        />
        <Animated.Image
          source={require('../../assets/play-as-black.jpg')}
          style={[styles.image, { opacity: secondImageOpacity }]}
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
        <View
          style={{
            width: windowWidth,
            // justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Playing as White</Text>
        </View>
        <View
          style={{
            width: windowWidth,
            // justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Playing as Black</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
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
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-Bold',
    color: 'white',
    paddingTop: '18%',
    // position: 'absolute',
    // top: 50,
    // left: 20,
  },
});

export default SwipeableImageSwitcher;
