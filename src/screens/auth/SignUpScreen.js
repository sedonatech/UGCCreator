import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {BLACK, BLACK_SECONDARY, BLUE, WHITE} from '../../theme/Colors';
import Logo from '../../../asssets/svgs/Logo';
import TemplateText from '../../components/TemplateText';
import {SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN} from '../../theme/Layout';
import Button from '../../components/Button';
import {LOGIN} from '../../navigation/ScreenNames';
import TemplateTextInput from '../../components/TemplateTextInput';
import Wrapper from '../../components/Wrapper';
import {isAndroid} from '../../Utils/Platform';

const SignUpScreen = ({navigation, route}) => {
  const type = route.params?.type;
  const namePlaceholder = useMemo(() => {
    if (!type) {
      return 'Full Name';
    }
    return type === 'brand' ? 'Brand Name' : 'Full Name';
  }, [type]);

  return (
    <Wrapper
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.container}
      keyboard>
      <Logo
        height={SCREEN_WIDTH / 3}
        width={SCREEN_WIDTH / 3}
        style={styles.logo}
      />

      <TemplateText title bold caps center color={BLACK} style={styles.title}>
        Lets Create Your Account
      </TemplateText>
      <TemplateText size={18} color={BLACK_SECONDARY}>
        Enter your credentials to continue
      </TemplateText>

      <TemplateTextInput placeholder={namePlaceholder} style={styles.input} />
      <TemplateTextInput placeholder="Email" style={styles.input} />
      <TemplateTextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Create Account"
          onPress={() => {}}
          style={styles.button}
          titleColor={BLACK}
        />
        <TemplateText size={14} center italic style={styles.loginText}>
          By creating an account, you agree to our {''}
          <TemplateText semiBold underLine size={16}>
            Terms of Service {''}
          </TemplateText>
          and {''}
          <TemplateText semiBold underLine size={14}>
            Privacy Policy
          </TemplateText>
        </TemplateText>

        <TemplateText size={16} center style={styles.signupLink}>
          Already a member? {''}
          <TemplateText
            color={BLUE}
            underLine
            size={16}
            onPress={() => navigation.navigate(LOGIN)}>
            Login
          </TemplateText>
        </TemplateText>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
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
  contentContainerStyle: {
    flex: isAndroid ? 0 : 1,
    height: isAndroid ? SCREEN_HEIGHT : null,
    backgroundColor: WHITE,
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
    flex: 1,
    marginTop: WRAPPER_MARGIN * 2,
    alignSelf: 'center',
  },
  button: {
    marginTop: 24,
  },
  loginText: {
    marginTop: WRAPPER_MARGIN,
  },
  signupLink: {
    marginTop: WRAPPER_MARGIN * 2,
  },
  title: {
    marginBottom: WRAPPER_MARGIN,
  },
  input: {
    height: 60,
    width: SCREEN_WIDTH - 32,
    borderWidth: 0.4,
    borderColor: BLACK_SECONDARY,
    borderRadius: 8,
    paddingLeft: 16,
    marginTop: WRAPPER_MARGIN * 2,
  },
});
export default SignUpScreen;
