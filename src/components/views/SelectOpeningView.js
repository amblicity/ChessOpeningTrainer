import React from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getOpeningsWithDetails } from '../../state/selectors'; // Adjust path as needed

export const SelectOpeningView = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const openings = useSelector(getOpeningsWithDetails);

  const clearProgress = () => {
    dispatch({
      type: 'progress/reset',
    });
    alert('All progress has been reset!');
  };

  const setSelectedOpening = (openingKey, playerPlayingAs) => {
    dispatch({
      type: 'currentPlay/setSelectedOpening',
      payload: { opening: openingKey, playerPlayingAs },
    });
    navigation.navigate('Play Opening Lines');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Image
          source={require('../../../assets/img/header.jpg')}
          style={styles.image}
        />
        <View style={styles.openingList}>
          <Text style={{ fontFamily: 'Dosis-SemiBold', fontSize: 20 }}>
            Playing as white:
          </Text>
          {openings
            .filter(op => op.initialPlayerColor === 'w')
            .map((op, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedOpening(op.key, 'w')}>
                <Text>{op.name}</Text>
              </TouchableOpacity>
            ))}
          <View style={{ height: 20 }} />

          <Text>Playing as black:</Text>
          {openings
            .filter(op => op.initialPlayerColor === 'b')
            .map((op, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedOpening(op.key, 'b')}>
                <Text>{op.name}</Text>
              </TouchableOpacity>
            ))}
          <View style={{ height: 20 }} />

          <TouchableOpacity onPress={clearProgress}>
            <Text>RESET PROGRESS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#edf4fe',
  },
  image: {
    marginTop: 30,
    height: 200,
    width: '90%',
    resizeMode: 'contain',
  },
  openingList: {
    width: '100%',
    paddingHorizontal: '5%',
  },
};
