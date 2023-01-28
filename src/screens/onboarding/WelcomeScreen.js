import React from 'react';
import Button from '../../components/Button';
import {View, StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/Layout';
import {BRAND_BLUE, DEEP_LAVENDER, WHITE} from '../../theme/Colors';
import {ONBOARDING} from '../../navigation/ScreenNames';
import Blob from '../../../asssets/svgs/Blob';
import BrandLogo from '../../../asssets/svgs/BrandLogo';
const WelcomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Blob color={DEEP_LAVENDER} top />
      <Blob right />
      <Blob color={DEEP_LAVENDER} bottom />

      <BrandLogo height={SCREEN_HEIGHT / 2} width={SCREEN_WIDTH / 1.2} />

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
    backgroundColor: BRAND_BLUE,
  },
  logo: {
    flex: 1,
    marginTop: SCREEN_HEIGHT / 9,
    alignSelf: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 40,
  },
});
export default WelcomeScreen;
