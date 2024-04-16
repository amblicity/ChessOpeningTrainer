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

  const OpeningChoiceCard = ({ key, op, color }) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 10,
          height: 125,
          width: '100%',
          backgroundColor: '#376897',
          borderRadius: 12,
          flexDirection: 'row',
          marginBottom: 20,
        }}
        key={key}
        onPress={() => setSelectedOpening(op.key, color)}>
        <View
          style={{
            width: '20%',
            backgroundColor: '#5889AD',
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          }}
        />
        <View style={{ marginTop: 10, marginLeft: 15, width: '70%' }}>
          <Text
            style={{
              fontFamily: 'Muli-Extralight',
              fontWeight: 600,
              fontSize: 18,
              color: 'white',
            }}>
            {op.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Muli-Extralight',
              fontWeight: 200,
              color: 'white',
              fontSize: 12,
            }}>
            The Caro-Kann Defense is a common defense against e4, characterized
            by d4 and c6. It aims for a solid, yet flexible position.
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View style={styles.openingList}>
          <Text
            style={{
              fontFamily: 'Muli-ExtraLight',
              fontSize: 22,
              fontWeight: 'regular',
              color: '#B24B47',
            }}>
            Playing as white:
          </Text>
          {openings
            .filter(op => op.initialPlayerColor === 'w')
            .map((op, index) => (
              <OpeningChoiceCard key={index} op={op} color={'w'} />
            ))}
          <View style={{ height: 20 }} />
          <Text
            style={{
              fontFamily: 'Muli-ExtraLight',
              fontSize: 22,
              fontWeight: 'regular',
              color: '#B24B47',
            }}>
            Playing as black:
          </Text>
          {openings
            .filter(op => op.initialPlayerColor === 'b')
            .map((op, index) => (
              <OpeningChoiceCard key={index} op={op} color={'b'} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F4EAE2',
  },
  image: {
    marginTop: 30,
    height: 200,
    width: '90%',
    resizeMode: 'contain',
  },
  openingList: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: '5%',
  },
};
