import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export const SelectOpeningView = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const clearProgress = () => {
    dispatch({
      type: 'progress/reset',
    });

    alert('All progress has been reset!');
  };

  const setSelectedOpening = (opening, playingAs) => {
    dispatch({
      type: 'currentPlay/setSelectedOpening',
      payload: { opening, playingAs },
    });

    navigation.navigate('Play Opening Lines');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../..//assets/img/header.jpg')}
        style={styles.image}
      />

      <View style={styles.openingList}>
        <Text style={{ fontFamily: 'Dosis-SemiBold', fontSize: 20 }}>
          Playing as white:
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedOpening('RuyLopez', 'w');
          }}>
          <Text>RuyLopez</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
        <Text>Playing as black:</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedOpening('QueensGambitAccepted', 'b');
          }}>
          <Text>Queens Gambit Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedOpening('CaroKann', 'b');
          }}>
          <Text>Caro-Kann</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
        <TouchableOpacity
          onPress={() => {
            clearProgress();
          }}>
          <Text>RESET PROGRESS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#edf4fe',
    alignItems: 'center',
  },
  image: {
    marginTop: 30,
    height: '45%',
    resizeMode: 'contain',
  },
  openingList: {
    width: '100%',
    paddingHorizontal: '5%',
  },
};
