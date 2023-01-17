import React from 'react';
import Button from '../../components/Button';
import {View, StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/Layout';
import {BLACK, DEEP_LAVENDER, WHITE} from '../../theme/Colors';
import {ONBOARDING} from '../../navigation/ScreenNames';
import Blob from '../../../asssets/svgs/Blob';
import TemplateText from '../../components/TemplateText';
import BackgroundImage from '../../components/BackgroundImage';
import backgroundImage from '../../../asssets/images/Subject.png';
import {isIOS} from '../../Utils/Platform';
const WelcomeScreen = ({navigation}) => {
  return (
      <View style={styles.container}>
        <Blob color={DEEP_LAVENDER} top />
        <Blob right />
        <Blob color={DEEP_LAVENDER} bottom />

        <BackgroundImage
            source={backgroundImage}
            style={styles.backgroundImage}
        />
        <TemplateText
            color={BLACK}
            size={30}
            caps
            bold
            center
            style={styles.title}>
          UGC {'\n'} Creator {'\n'} APP
        </TemplateText>
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
    flex: 1,
    marginTop: SCREEN_HEIGHT / 9,
    alignSelf: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 40,
  },
  backgroundImage: {
    height: '44%',
    width: '100%',
    top: 40,
  },
  title: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 3.5,
    left: SCREEN_WIDTH / 4,
    fontFamily: isIOS ? 'Baskerville-BoldItalic' : 'monospace',
  },
});
export default WelcomeScreen;
