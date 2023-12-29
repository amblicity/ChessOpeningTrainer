import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

export const SelectScenarioView = () => {
  const setSelectedOpening = useDispatch({
    type: 'currentPlay/setScenario',
    payload: 'QueensGambitAccepted',
  });

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setSelectedOpening();
        }}>
        <Text>Queens Gambit Accepted</Text>
      </TouchableOpacity>
    </View>
  );
};
