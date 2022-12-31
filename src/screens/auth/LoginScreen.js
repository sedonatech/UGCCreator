import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {BLACK, BLACK_SECONDARY, BLUE, WHITE} from '../../theme/Colors';
import Logo from '../../../asssets/svgs/Logo';
import TemplateText from '../../components/TemplateText';
import {SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN} from '../../theme/Layout';
import Button from '../../components/Button';
import {ONBOARDING} from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import {isAndroid} from '../../Utils/Platform';
import TemplateTextInput from '../../components/TemplateTextInput';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();

  const [password, setPassword] = useState();

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      console.log('-> response', JSON.stringify(response, null, 2));
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
    } finally {
      setLoading(false);
    }
  };
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
        Welcome back!
      </TemplateText>
      <TemplateText size={18} color={BLACK_SECONDARY}>
        Enter your email and password to continue
      </TemplateText>
      <TemplateTextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        disabled={!email && !password}
      />
      <TemplateTextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={handleLogin}
          style={styles.button}
          titleColor={BLACK}
          loading={loading}
        />

        <TemplateText size={16} center italic style={styles.signupLink}>
          New to the UGC creator app? {''}
          <TemplateText
            color={BLUE}
            underLine
            size={16}
            onPress={() => navigation.navigate(ONBOARDING)}>
            Sign Up
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
    position: 'absolute',
    top: 30,
  },
  buttonContainer: {
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
export default LoginScreen;
