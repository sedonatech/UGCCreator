import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import {
    BLACK,
    BLACK_10,
    BLACK_SECONDARY,
    BLUE,
    BRAND_BLUE,
    DARK_OVERLAY,
    ERROR_RED,
    GREY_30,
    ONBOARDING_BLUE,
    WHITE,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { LOGIN, WEBVIEW } from '../../navigation/ScreenNames';
import TemplateTextInput from '../../components/TemplateTextInput';
import Wrapper from '../../components/Wrapper';
import Error from '../../components/Error';
import { emailValid, passwordValid, isEmpty } from '../../Utils/validation';
import useProfile from '../../hooks/user/useProfile';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import { useConfig } from '../../context/core';
import TemplateTouchable from '../../components/TemplateTouchable';
import TemplateIcon from '../../components/TemplateIcon';
import TemplateBox from '../../components/TemplateBox';
import ResizedImage from '../../components/ResizedImage';

const creatorAuthImage = require('../../../assets/images/onboarding/login.jpg');
const brandAuthImage = require('../../../assets/images/onboarding/brand-auth.jpg');

const CREATOR_PLACEHOLDER = 'Your Name';
const BRAND_PLACEHOLDER = 'Your Brand Name';
const SignUpScreen = ({ navigation, route }) => {
    const { mainDomain } = useConfig();

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

    const showEmailError = useMemo(() => emailTouched && !emailValid(email), [email, emailTouched]);

    const showPasswordError = useMemo(() => passwordTouched && !passwordValid(password), [password, passwordTouched]);

    const showNameError = useMemo(() => nameTouched && isEmpty(name), [name, nameTouched]);

    const [loading, setLoading] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const disabled = useMemo(() => (
        !emailValid(email)
      || !passwordValid(password)
      || isEmpty(name)
      || loading
      || !!error
    ), [email, password, name, loading, error]);

    useEffect(() => {
        setError(null);
    }, []);

    const { createCreatorProfile, createBrandProfile } = useProfile();

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

    const image = isCreator ? creatorAuthImage : brandAuthImage;


    return (
        <Wrapper
            contentContainerStyle={styles.contentContainerStyle}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            keyboard
        >
            <TemplateBox borderRadius={20} overflow='hidden'>
                <TemplateBox style={{position: 'absolute', paddingTop: 8, alignSelf: 'center', alignItems: 'center', zIndex: 99}} backgroundColor={DARK_OVERLAY}>
                 <BrandLogo height={58} width={282} color={WHITE} />
                </TemplateBox>
                <ResizedImage source={image} style={{height: 345, width: WRAPPED_SCREEN_WIDTH}} />
            </TemplateBox>


            <TemplateBox width={WRAPPED_SCREEN_WIDTH} mt={20}>
                <TemplateText
                    size={21}
                    medium
                    center
                    color={ONBOARDING_BLUE}
                    style={styles.title}
                >
                    {`Create your ${isCreator ? 'creator' : 'brand'} account `}
                </TemplateText>
            </TemplateBox>

            <TemplateTextInput
                placeholder={namePlaceholder}
                style={[styles.input, showNameError && styles.error]}
                value={name}
                onChangeText={(text) => setName(text)}
                onBlur={() => setNameTouched(true)}
            />
            <Error show={showNameError}>
                {`Please enter a valid ${
                    isCreator ? 'name' : 'brand name'
                } `}
            </Error>
            <TemplateTextInput
                placeholder="Your Email"
                style={[styles.input, showEmailError && styles.error]}
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                onBlur={() => setEmailTouched(true)}
                autoCapitalize="none"
            />
            <Error show={showEmailError}>Please enter a valid email</Error>

            <View style={styles.passwordContainer}>
                <TemplateTextInput
                    placeholder="Password"
                    style={[styles.input, showPasswordError && styles.error]}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    onBlur={() => setPasswordTouched(true)}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                />
                <TemplateTouchable
                    onPress={() => setPasswordVisible((prevState) => !prevState)}
                    style={styles.passwordIcon}
                >
                    <TemplateIcon
                        name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={BLACK}
                        family="Ionicons"
                    />
                </TemplateTouchable>
            </View>
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
                    color={ONBOARDING_BLUE}
                />
                <TemplateText
                    size={14}
                    center
                    style={styles.loginText}
                    medium
                    onPress={() => {
                        if (mainDomain) {
                            navigation.navigate(WEBVIEW, {
                                url: mainDomain,
                            });
                        }
                    }}
                >
                    By creating an account, you agree to our
                    {' '}

                    <TemplateText
                        medium
                        underLine
                        size={16}
                        onPress={() => {
                            if (mainDomain) {
                                navigation.navigate(WEBVIEW, {
                                    url: mainDomain,
                                });
                            }
                        }}
                        color={ONBOARDING_BLUE}
                    >
                        Terms of Service
                        {' '}

                    </TemplateText>
                    and
                    {' '}

                    <TemplateText medium underLine size={14} color={ONBOARDING_BLUE}>
                        Privacy Policy
                    </TemplateText>
                </TemplateText>

                <TemplateText size={16} center style={styles.signupLink} medium>
                    Already a member?
                    {' '}

                    <TemplateText
                        color={ONBOARDING_BLUE}
                        underLine
                        size={16}
                        medium
                        onPress={() => navigation.navigate(LOGIN)}
                    >
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
    contentContainerStyle: {
    },
    logo: {
        alignSelf: 'center',
    },
    buttonContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    button: {
        marginTop: 24,
    },
    loginText: {
        marginTop: WRAPPER_MARGIN,
    },
    signupLink: {
        marginTop: 16,
    },
    title: {
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderRadius: 8,
        paddingLeft: 16,
        marginTop: 16,
        borderColor: BLACK_10,
        backgroundColor: GREY_30
    },
    error: {
        borderColor: ERROR_RED,
    },
    generalError: {
        marginVertical: 10,
        alignSelf: 'center',
    },
    passwordIcon: {
        bottom: 20,
        right: 20,
        position: 'absolute',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export default SignUpScreen;
