import React from 'react';
import Logo from '../../../asssets/svgs/Logo';
import Button from '../../components/Button';
import {View, StyleSheet} from 'react-native';
import {SCREEN_HEIGHT} from '../../theme/Layout';
import {WHITE} from '../../theme/Colors';
import {ONBOARDING} from '../../navigation/ScreenNames';
const WelcomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Logo style={styles.logo} />
      <Button
        title="Get Started"
        onPress={() => {
          navigation.navigate(ONBOARDING);
        }}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  logo: {
    marginTop: SCREEN_HEIGHT / 9,
    alignSelf: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 40,
  },
});
export default WelcomeScreen;
