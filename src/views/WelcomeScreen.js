import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import openingData from '../data/openingdb.json';
import { BlurView } from '@react-native-community/blur';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import DebugView from './DebugView';

export const WelcomeScreen = () => {
  const navigation = useNavigation();
  const openings = openingData.openings;

  /**
   * Storing all openings from database to redux
   * Later this database will be loaded from a server
   * and updated. Furthermore InAppPurchases can influence
   * the possible usage of some openings. Think: "Buy CaroKann".
   */
  const dispatch = useDispatch();
  const keys = openings.map(opening => opening.key);

  dispatch({
    type: 'db/setOpenings',
    payload: keys,
  });

  const [showHelp, setShowHelp] = useState(false);

  return openings ? (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../..//assets/img/header.jpg')}
        style={styles.image}
      />
      <Text>MENU:</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SelectOpening');
        }}>
        <Text>START</Text>
      </TouchableOpacity>
      <DebugView openingKey={'CaroKann'} />
      <TouchableOpacity
        onPress={() => {
          setShowHelp(true);
        }}>
        <Text>HELP</Text>
      </TouchableOpacity>
      {showHelp === true && (
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      )}
      {showHelp === true && (
        <View
          style={[
            styles.absolute,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setShowHelp(false);
            }}>
            <Text>CLOSE</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  ) : (
    <SafeAreaView>
      <Text>Loading</Text>
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
    margin: 20,
    height: '55%',
    resizeMode: 'contain',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};
