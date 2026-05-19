import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { BLACK, ERROR_RED, ONBOARDING_BLUE, WHITE } from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH } from '../../theme/Layout';
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
                const { fullName } = result.appleData;
                const displayName = fullName
                    ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
                    : result.user.email?.split('@')[0] || 'User';

                await createProfile(displayName, result.user, type);
            }
        } catch (e) {
            console.log('Apple Sign-Up error:', e);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        try {
            if (type) {
                await AsyncStorage.setItem('@userType', type);
            }
            const response = await auth().createUserWithEmailAndPassword(email, password);

            if (response?.user) {
                await createProfile(name, response?.user, type);
            }
        } catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                setError(t('auth.signup.errors.emailInUse'));
            }

            if (e.code === 'auth/invalid-email') {
                setError(t('auth.signup.errors.emailInvalid'));
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
            <View style={styles.hero}>
                <ResizedImage source={image} style={{ height: 320, width: SCREEN_WIDTH }} />
                <LinearGradient
                    colors={['rgba(10,8,25,0.55)', 'rgba(10,8,25,0)']}
                    style={styles.heroTopFade}
                />
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                    style={styles.heroBottomFade}
                />
                <View style={styles.heroLogo}>
                    <BrandLogo height={54} width={262} color={WHITE} />
                </View>
            </View>

            <View style={styles.formCard}>
                <TemplateBoxTitle>
                    {isCreator ? t('auth.signup.createCreatorAccount') : t('auth.signup.createBrandAccount')}
                </TemplateBoxTitle>

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
                        height={56}
                        width={SCREEN_WIDTH - 40}
                        loading={loading}
                        disabled={disabled}
                        color={BLACK}
                        titleSize={17}
                    />

                    {Platform.OS === 'ios' && (
                        <View
                            style={[styles.appleButtonWrapper, (loading || appleLoading) && styles.disabledButton]}
                        >
                            <AppleButton
                                buttonStyle={AppleButton.Style.BLACK}
                                buttonType={AppleButton.Type.SIGN_UP}
                                style={styles.appleButton}
                                cornerRadius={28}
                                onPress={() => {
                                    if (!loading && !appleLoading) {
                                        handleAppleSignUp();
                                    }
                                }}
                            />
                        </View>
                    )}

                    <TemplateText
                        size={13}
                        center
                        style={styles.loginText}
                        medium
                        color="#6B7280"
                        onPress={() => {
                            if (mainDomain) {
                                navigation.navigate(WEBVIEW, { url: mainDomain });
                            }
                        }}
                    >
                        {t('auth.signup.termsPrefix')}{' '}
                        <TemplateText
                            medium
                            size={13}
                            onPress={() => {
                                if (mainDomain) {
                                    navigation.navigate(WEBVIEW, { url: mainDomain });
                                }
                            }}
                            color={ONBOARDING_BLUE}
                        >
                            {t('auth.signup.termsOfService')}{' '}
                        </TemplateText>
                        {t('auth.signup.and')}{' '}
                        <TemplateText medium size={13} color={ONBOARDING_BLUE}>
                            {t('auth.signup.privacyPolicy')}
                        </TemplateText>
                    </TemplateText>

                    <TemplateText size={15} center style={styles.signupLink} medium color="#6B7280">
                        {t('auth.signup.alreadyMember')}{' '}
                        <TemplateText
                            color={ONBOARDING_BLUE}
                            size={15}
                            semiBold
                            onPress={() => navigation.navigate(LOGIN)}
                        >
                            {t('auth.signup.login')}
                        </TemplateText>
                    </TemplateText>
                </View>
            </View>
        </Wrapper>
    );
};

const TemplateBoxTitle = ({ children }) => (
    <View style={styles.titleWrap}>
        <TemplateText size={26} bold color={BLACK}>
            {children}
        </TemplateText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: WHITE,
    },
    contentContainerStyle: {},
    hero: {
        width: SCREEN_WIDTH,
        height: 320,
    },
    heroTopFade: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    heroBottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    heroLogo: {
        position: 'absolute',
        top: 56,
        alignSelf: 'center',
        alignItems: 'center',
    },
    formCard: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        marginTop: -24,
        paddingTop: 8,
    },
    titleWrap: {
        width: WRAPPED_SCREEN_WIDTH,
    },
    buttonContainer: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    button: {
        marginTop: 22,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
    },
    loginText: {
        marginTop: 18,
        width: SCREEN_WIDTH - 60,
        alignSelf: 'center',
        lineHeight: 19,
    },
    signupLink: {
        marginTop: 14,
    },
    input: {
        height: 58,
        width: SCREEN_WIDTH - 40,
        borderWidth: 1,
        borderColor: '#E6E8EC',
        borderRadius: 18,
        paddingLeft: 18,
        marginTop: 14,
        backgroundColor: '#F6F7F9',
    },
    error: {
        borderColor: ERROR_RED,
    },
    generalError: {
        marginVertical: 10,
        alignSelf: 'center',
    },
    passwordIcon: {
        bottom: 19,
        right: 20,
        position: 'absolute',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appleButtonWrapper: {
        width: SCREEN_WIDTH - 40,
        height: 52,
        marginTop: 14,
        borderRadius: 28,
        overflow: 'hidden',
    },
    appleButton: {
        width: '100%',
        height: 52,
    },
    disabledButton: {
        opacity: 0.5,
    },
});
export default SignUpScreen;
