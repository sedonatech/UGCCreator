import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BLACK,
  BLACK_10,
  BLACK_SECONDARY,
  BLUE,
  BRAND_BLUE,
  DEEP_LAVENDER,
  ERROR_RED,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import {SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN} from '../../theme/Layout';
import Button from '../../components/Button';
import {LOGIN} from '../../navigation/ScreenNames';
import TemplateTextInput from '../../components/TemplateTextInput';
import Wrapper from '../../components/Wrapper';
import Error from '../../components/Error';
import {emailValid, passwordValid, isEmpty} from '../../Utils/validation';
import useProfile from '../../hooks/user/useProfile';
import Blob from '../../../asssets/svgs/Blob';
import BrandLogo from '../../../asssets/svgs/BrandLogo';
import {isIOS} from '../../Utils/Platform';

const CREATOR_PLACEHOLDER = 'Creator';
const BRAND_PLACEHOLDER = 'Brand';
const SignUpScreen = ({navigation, route}) => {
  const type = route.params?.type;
  const isCreator = type === 'creator';

  const namePlaceholder = useMemo(() => {
    if (!type) {
      return CREATOR_PLACEHOLDER;
    }
    return isCreator ? CREATOR_PLACEHOLDER : BRAND_PLACEHOLDER;
  }, [type, isCreator]);

  const [name, setName] = useState();

  const [email, setEmail] = useState();

  const [password, setPassword] = useState();

  const [emailTouched, setEmailTouched] = useState(false);

  const [passwordTouched, setPasswordTouched] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);

  const [error, setError] = useState();

  const showEmailError = useMemo(() => {
    return emailTouched && !emailValid(email);
  }, [email, emailTouched]);

  const showPasswordError = useMemo(() => {
    return passwordTouched && !passwordValid(password);
  }, [password, passwordTouched]);

  const showNameError = useMemo(() => {
    return nameTouched && isEmpty(name);
  }, [name, nameTouched]);

  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => {
    return (
      !emailValid(email) ||
      !passwordValid(password) ||
      isEmpty(name) ||
      loading ||
      !!error
    );
  }, [email, password, name, loading, error]);

  const {createCreatorProfile, createBrandProfile} = useProfile();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('@userType', namePlaceholder);
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      if (response?.user) {
        if (isCreator) {
          await createCreatorProfile(name, response?.user);
        } else {
          await createBrandProfile(name, response?.user);
        }
      }
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('That email address is already in use!');
      }

      if (e.code === 'auth/invalid-email') {
        setPassword('That email address is invalid!');
      }
      setLoading(false);
    }
  };

  return (
    <Wrapper
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboard>
      <BrandLogo height={300} width={SCREEN_WIDTH / 1.4} style={styles.logo} />
      <Blob color={DEEP_LAVENDER} top />
      <Blob right />
      <Blob color={DEEP_LAVENDER} bottom />

      <TemplateText
        size={18}
        bold
        caps
        center
        color={BLACK}
        style={styles.title}>
        Lets Create Your Account
      </TemplateText>
      <TemplateText size={16} color={BLACK_SECONDARY} style={styles.subtitle}>
        Enter your credentials to continue
      </TemplateText>

      <TemplateTextInput
        placeholder={namePlaceholder}
        style={[styles.input, showNameError && styles.error]}
        value={name}
        onChangeText={text => setName(text)}
        onBlur={() => setNameTouched(true)}
      />
      <Error show={showNameError}>{`Please enter a valid ${
        isCreator ? 'name' : 'brand name'
      } `}</Error>
      <TemplateTextInput
        placeholder="Email"
        style={[styles.input, showEmailError && styles.error]}
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        onBlur={() => setEmailTouched(true)}
        autoCapitalize="none"
      />
      <Error show={showEmailError}>Please enter a valid email</Error>
      <TemplateTextInput
        placeholder="Password"
        style={[styles.input, showPasswordError && styles.error]}
        value={password}
        onChangeText={text => setPassword(text)}
        onBlur={() => setPasswordTouched(true)}
        secureTextEntry
        autoCapitalize="none"
      />
      <Error show={showPasswordError}>Please enter a valid password</Error>

      <View style={styles.buttonContainer}>
        <Error show={!!error} style={styles.generalError}>
          {error}
        </Error>
        <Button
          title="Create Account"
          onPress={handleSignUp}
          style={styles.button}
          loading={loading}
          disabled={disabled}
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
    backgroundColor: BRAND_BLUE,
    paddingBottom: 44,
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
    backgroundColor: BRAND_BLUE,
  },
  textContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
    marginTop: WRAPPER_MARGIN,
  },
  logo: {
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: WRAPPER_MARGIN * 2,
    alignSelf: 'center',
    marginBottom: WRAPPER_MARGIN * 4,
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
    fontFamily: isIOS ? 'Baskerville-BoldItalic' : 'monospace',
  },
  subtitle: {
    fontFamily: isIOS ? 'Baskerville-BoldItalic' : 'monospace',
  },
  input: {
    height: 60,
    width: SCREEN_WIDTH - 32,
    borderWidth: 0.4,
    borderRadius: 8,
    paddingLeft: 16,
    marginTop: WRAPPER_MARGIN * 2,
    borderColor: BLACK_10,
  },
  error: {
    borderColor: ERROR_RED,
  },
  generalError: {
    marginVertical: 10,
    alignSelf: 'center',
  },
});
export default SignUpScreen;
