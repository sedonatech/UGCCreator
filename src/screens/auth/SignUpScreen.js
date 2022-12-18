import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {BLACK, BLACK_SECONDARY, BLUE, WHITE} from '../../theme/Colors';
import Logo from '../../../asssets/svgs/Logo';
import TemplateText from '../../components/TemplateText';
import {SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN} from '../../theme/Layout';
import Button from '../../components/Button';
import {LOGIN} from '../../navigation/ScreenNames';
import TemplateTextInput from '../../components/TemplateTextInput';
import Wrapper from '../../components/Wrapper';

const CREATOR_PLACEHOLDER = 'Creator';
const BRAND_PLACEHOLDER = 'Brand';
const SignUpScreen = ({navigation, route}) => {
  const type = route.params?.type;
  const namePlaceholder = useMemo(() => {
    if (!type) {
      return CREATOR_PLACEHOLDER;
    }
    return type === 'brand' ? BRAND_PLACEHOLDER : CREATOR_PLACEHOLDER;
  }, [type]);

  const [name, setName] = useState();

  const [email, setEmail] = useState();

  const [password, setPassword] = useState();

  const [loading, setLoading] = useState(false);
  const handleSignUp = () => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        setLoading(false);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <Wrapper
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.container}
      showsVerticalScrollIndicator={false}
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

      <TemplateTextInput
        placeholder={namePlaceholder}
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
      />
      <TemplateTextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
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
          title="Create Account"
          onPress={handleSignUp}
          style={styles.button}
          titleColor={BLACK}
          loading={loading}
          disabled={!name && !email && !password}
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
    flex: 1,
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
    height: SCREEN_HEIGHT,
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
