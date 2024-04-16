import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import openingData from '../../data/openingdb.json';
import { BlurView } from '@react-native-community/blur';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import DebugView from './notinuse/DebugView';

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

  const RedButton = ({ onPress, title, disabled }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: '80%',
          height: 60,
          backgroundColor: disabled ? '#9B9B9B' : '#B24B47',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          marginBottom: 10,
        }}>
        <Text
          style={{
            marginBottom: 5,
            fontFamily: 'Muli-ExtraLight',
            fontSize: 20,
            color: '#F3EBE2',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return openings ? (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/img/backmock.png')}
        style={styles.image}
      />
      <RedButton
        onPress={() => {
          navigation.navigate('SelectOpening');
        }}
        title={'Train openings'}
      />
      <RedButton
        onPress={() => {
          // navigation.navigate('SelectOpening');
        }}
        title={'Daily opening'}
        disabled={true}
      />
      <RedButton
        onPress={() => {
          // navigation.navigate('SelectOpening');
        }}
        title={'Guess The Eval'}
        disabled={true}
      />
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
    backgroundColor: '#F4EAE2',
    alignItems: 'center',
  },
  image: {
    marginBottom: 30,
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
