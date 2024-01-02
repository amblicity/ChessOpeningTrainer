import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export const SelectScenarioView = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const clearProgress = () => {
    dispatch({
      type: 'progress/reset',
    });

    alert('All progress has been reset!');
  };

  const setSelectedOpening = opening => {
    dispatch({
      type: 'currentPlay/setScenario',
      payload: opening,
    });

    navigation.navigate('Play Opening Lines');
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setSelectedOpening('QueensGambitAccepted');
        }}>
        <Text>Queens Gambit Accepted</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSelectedOpening('KingsIndianDefense');
        }}>
        <Text>King's Indian Defense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          clearProgress();
        }}>
        <Text>RESET PROGRESS</Text>
      </TouchableOpacity>
    </View>
  );
};
