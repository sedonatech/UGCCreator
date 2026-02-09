/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { BLACK, BLACK_10, ERROR_RED, GREY_30, ONBOARDING_BLUE, WHITE } from '../../theme/Colors';
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
import useAppleAuth from '../../hooks/auth/useAppleAuth';
import useTranslation from '../../hooks/useTranslation';

const creatorAuthImage = require('../../../assets/images/onboarding/login.jpg');
const brandAuthImage = require('../../../assets/images/onboarding/brand-auth.jpg');

const SignUpScreen = ({ navigation, route }) => {
    const { mainDomain } = useConfig();
    const { t } = useTranslation();

    const type = route.params?.type;

    const isCreator = type === 'creator';

    const namePlaceholder = useMemo(() => {
        if (!type) {
            return t('auth.signup.namePlaceholder');
        }
        return isCreator ? t('auth.signup.namePlaceholder') : t('auth.signup.brandNamePlaceholder');
    }, [type, isCreator, t]);

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

    const { createProfile } = useProfile();

    const { onAppleButtonPress, loading: appleLoading, error: appleError } = useAppleAuth();

    const disabled = useMemo(
        () => !emailValid(email) || !passwordValid(password) || isEmpty(name) || loading || appleLoading || !!error,
        [email, password, name, loading, appleLoading, error],
    );

    useEffect(() => {
        setError(null);
    }, []);

    const handleAppleSignUp = async () => {
        try {
            const result = await onAppleButtonPress();

            if (result && result.isNewUser) {
                // Extract name from Apple auth response
                const { fullName } = result.appleData;
                const displayName = fullName
                    ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
                    : result.user.email?.split('@')[0] || 'User';

                // Create profile with the type from route params
                await createProfile(displayName, result.user, type);
            }
        } catch (e) {
            console.log('Apple Sign-Up error:', e);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        try {
            await AsyncStorage.setItem('@userType', namePlaceholder);
            const response = await auth().createUserWithEmailAndPassword(email, password);

            if (response?.user) {
                await createProfile(name, response?.user, type);
            }
        } catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                setError(t('auth.signup.errors.emailInUse'));
            }

            if (e.code === 'auth/invalid-email') {
                setPassword(t('auth.signup.errors.emailInvalid'));
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
            <TemplateBox borderRadius={20} overflow="hidden">
                <TemplateBox
                    style={{
                        position: 'absolute',
                        top: 50,
                        alignSelf: 'center',
                        alignItems: 'center',
                        zIndex: 99,
                    }}
                >
                    <BrandLogo height={58} width={282} color={WHITE} />
                </TemplateBox>
                <ResizedImage source={image} style={{ height: 350, width: SCREEN_WIDTH }} />
            </TemplateBox>

            <TemplateBox width={WRAPPED_SCREEN_WIDTH} mt={20}>
                <TemplateText size={22} medium center style={styles.title}>
                    {isCreator ? t('auth.signup.createCreatorAccount') : t('auth.signup.createBrandAccount')}
                </TemplateText>
            </TemplateBox>

            <TemplateTextInput
                placeholder={namePlaceholder}
                style={[styles.input, showNameError && styles.error]}
                value={name}
                onChangeText={text => setName(text)}
                onBlur={() => setNameTouched(true)}
            />
            <Error show={showNameError}>
                {isCreator ? t('auth.signup.errors.invalidName') : t('auth.signup.errors.invalidBrandName')}
            </Error>
            <TemplateTextInput
                placeholder={t('auth.signup.emailPlaceholder')}
                style={[styles.input, showEmailError && styles.error]}
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                onBlur={() => setEmailTouched(true)}
                autoCapitalize="none"
            />
            <Error show={showEmailError}>{t('auth.signup.errors.invalidEmail')}</Error>

            <View style={styles.passwordContainer}>
                <TemplateTextInput
                    placeholder={t('auth.signup.passwordPlaceholder')}
                    style={[styles.input, showPasswordError && styles.error]}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    onBlur={() => setPasswordTouched(true)}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                />
                <TemplateTouchable
                    onPress={() => setPasswordVisible(prevState => !prevState)}
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
            <Error show={showPasswordError}>{t('auth.signup.errors.invalidPassword')}</Error>

            <View style={styles.buttonContainer}>
                <Error show={!!error} style={styles.generalError}>
                    {error}
                </Error>
                <Error show={!!appleError} style={styles.generalError}>
                    {appleError}
                </Error>
                <Button
                    title={t('auth.signup.createAccountButton')}
                    onPress={handleSignUp}
                    style={styles.button}
                    height={50}
                    width={SCREEN_WIDTH - 40}
                    loading={loading}
                    disabled={disabled}
                    color={BLACK}
                />

                {Platform.OS === 'ios' && (
                    <View style={[styles.appleButtonWrapper, (loading || appleLoading) && styles.disabledButton]}>
                        <AppleButton
                            buttonStyle={AppleButton.Style.BLACK}
                            buttonType={AppleButton.Type.SIGN_UP}
                            style={styles.appleButton}
                            onPress={() => {
                                if (!loading && !appleLoading) {
                                    handleAppleSignUp();
                                }
                            }}
                        />
                    </View>
                )}

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
                    {t('auth.signup.termsPrefix')}{' '}
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
                        {t('auth.signup.termsOfService')}{' '}
                    </TemplateText>
                    {t('auth.signup.and')}{' '}
                    <TemplateText medium underLine size={14} color={ONBOARDING_BLUE}>
                        {t('auth.signup.privacyPolicy')}
                    </TemplateText>
                </TemplateText>

                <TemplateText size={16} center style={styles.signupLink} medium>
                    {t('auth.signup.alreadyMember')}{' '}
                    <TemplateText
                        color={ONBOARDING_BLUE}
                        underLine
                        size={16}
                        medium
                        onPress={() => navigation.navigate(LOGIN)}
                    >
                        {t('auth.signup.login')}
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
    contentContainerStyle: {},
    buttonContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    button: {
        marginTop: 24,
        borderRadius: 26,
    },
    loginText: {
        marginTop: WRAPPER_MARGIN,
    },
    signupLink: {
        marginTop: 16,
    },
    title: {},
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderRadius: 26,
        paddingLeft: 16,
        marginTop: 16,
        borderColor: BLACK_10,
        backgroundColor: GREY_30,
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
    appleButtonWrapper: {
        width: SCREEN_WIDTH - 40,
        height: 50,
        marginTop: 16,
        borderRadius: 26,
        overflow: 'hidden',
    },
    appleButton: {
        width: '100%',
        height: 50,
    },
    disabledButton: {
        opacity: 0.5,
    },
});
export default SignUpScreen;
