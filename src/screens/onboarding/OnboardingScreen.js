import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  BLACK,
  BLACK_SECONDARY,
  BLUE,
  DEEP_LAVENDER,
  WHITE,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import {SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN} from '../../theme/Layout';
import Button from '../../components/Button';
import {LOGIN, SIGN_UP} from '../../navigation/ScreenNames';
import Blob from '../../../asssets/svgs/Blob';
import backgroundImage from '../../../asssets/images/Subject.png';
import BackgroundImage from '../../components/BackgroundImage';
import {isIOS} from '../../Utils/Platform';
import BrandLogo from '../../../asssets/svgs/BrandLogo';
const OnboardingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <BrandLogo height={300} width={SCREEN_WIDTH / 1.4} />
      <Blob color={DEEP_LAVENDER} top />
      <Blob right />
      <Blob color={DEEP_LAVENDER} bottom />

      <View style={styles.textContainer}>
        <View style={styles.dot} />
        <TemplateText size={16} color={BLACK_SECONDARY} style={styles.subtitle}>
          Connect with top brands as a creator
        </TemplateText>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.dot} />
        <TemplateText size={16} color={BLACK_SECONDARY} style={styles.subtitle}>
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
        />
        <Button
          title="Register as a Brand"
          onPress={() =>
            navigation.navigate(SIGN_UP, {
              type: 'brand',
            })
          }
          style={styles.button}
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
    alignItems: 'center',
  },
  dot: {
    backgroundColor: BLACK,
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  textContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
    marginTop: WRAPPER_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  button: {
    marginBottom: 20,
  },
  loginText: {
    marginTop: 8,
  },
  title: {
    marginTop: SCREEN_HEIGHT / 2,
  },
  subtitle: {
    fontFamily: isIOS ? 'Baskerville-BoldItalic' : 'monospace',
  },
  backgroundImage: {
    height: '44%',
    width: '100%',
    top: 40,
  },
});
export default OnboardingScreen;
