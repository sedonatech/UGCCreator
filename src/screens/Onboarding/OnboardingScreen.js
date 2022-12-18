import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  BLACK,
  BLACK_SECONDARY,
  BLUE,
  BLUE_SECONDARY,
  WHITE,
} from '../../theme/Colors';
import Logo from '../../../asssets/svgs/Logo';
import TemplateText from '../../components/TemplateText';
import { SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN } from "../../theme/Layout";
import Button from '../../components/Button';
import {LOGIN, SIGN_UP} from '../../navigation/ScreenNames';
const OnboardingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Logo
        height={SCREEN_WIDTH / 3}
        width={SCREEN_WIDTH / 3}
        style={styles.logo}
      />

      <TemplateText title bold caps color={BLACK}>
        Where brands and creators connect
      </TemplateText>
      <View style={styles.textContainer}>
        <View style={styles.dot} />
        <TemplateText size={18} color={BLACK_SECONDARY}>
          Connect with top brands as a creator
        </TemplateText>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.dot} />
        <TemplateText size={18} color={BLACK_SECONDARY}>
          Connect with top creators as a brand
        </TemplateText>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Register as a Creator"
          onPress={() =>
            navigation.navigate(SIGN_UP, {
              type: 'creator',
            })
          }
          style={styles.button}
          titleColor={BLACK}
        />
        <Button
          title="Register as a Brand"
          onPress={() =>
            navigation.navigate(SIGN_UP, {
              type: 'brand',
            })
          }
          style={styles.button}
          titleColor={BLACK}
        />
        <TemplateText italic size={16} center style={styles.loginText}>
          Already joined? {''}
          <TemplateText
            color={BLUE}
            underLine
            size={16}
            onPress={() => navigation.navigate(LOGIN)}>
            Login
          </TemplateText>
        </TemplateText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: WRAPPER_MARGIN,
    alignItems: 'center',
  },
  dot: {
    backgroundColor: BLACK,
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 8,
    marginTop: 8,
  },
  textContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
    marginTop: WRAPPER_MARGIN,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: WRAPPER_MARGIN,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 5,
    alignSelf: 'center',
  },
  button: {
    marginVertical: 24,
  },
  loginText: {
    marginTop: 8,
  },
});
export default OnboardingScreen;
