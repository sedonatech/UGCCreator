import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { BLACK, ONBOARDING_BLUE, WHITE } from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { FORGOT_PASSWORD, ONBOARDING } from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import TemplateTextInput from '../../components/TemplateTextInput';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import Error from '../../components/Error';
import TemplateTouchable from '../../components/TemplateTouchable';
import TemplateIcon from '../../components/TemplateIcon';
import useProfile from '../../hooks/user/useProfile';
import ResizedImage from '../../components/ResizedImage';
import TemplateBox from '../../components/TemplateBox';
import useAppleAuth from '../../hooks/auth/useAppleAuth';
import useTranslation from '../../hooks/useTranslation';

const loginImage = require('../../../assets/images/onboarding/login-merit.jpg');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState();

    const [password, setPassword] = useState();

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const { updateProfile, getProfile } = useProfile();

    const { onAppleButtonPress, loading: appleLoading, error: appleError } = useAppleAuth();

    const { t } = useTranslation();

    const handleLogin = async () => {
        setLoading(true);
        try {
            if (error) {
                setError(null);
            }
            await auth().signInWithEmailAndPassword(email, password);
            const currentUser = auth().currentUser;
            if (!currentUser) return;
            const profile = await getProfile(currentUser.uid);
            const token = await messaging().getToken();

            const data = token
                ? { lastLoginTime: new Date().toISOString(), token }
                : { lastLoginTime: new Date().toISOString() };
            await updateProfile(data, profile?.id);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError(t('auth.errors.emailInUse'));
            }

            if (err.code === 'auth/invalid-email') {
                setError(t('auth.errors.invalidEmail'));
            }
            if (err.code === 'auth/wrong-password') {
                setError(t('auth.errors.invalidPassword'));
            }
            if (err.code === 'auth/user-not-found') {
                setError(t('auth.errors.userNotFound'));
            }
        }
        setLoading(false);
    };

    return (
        <Wrapper
            contentContainerStyle={styles.contentContainerStyle}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            keyboard
        >
            <View style={styles.hero}>
                <ResizedImage source={loginImage} style={styles.heroImage} />
                <LinearGradient
                    colors={['rgba(20,16,30,1)', 'rgba(20,16,30,1)', 'rgba(20,16,30,0)']}
                    locations={[0, 0.36, 1]}
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
                <TemplateBox width={WRAPPED_SCREEN_WIDTH}>
                    <TemplateText size={26} bold color={BLACK}>
                        {t('auth.login.title')}
                    </TemplateText>
                </TemplateBox>

                <TemplateTextInput
                    placeholder={t('auth.login.emailPlaceholder')}
                    style={styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                />
                <View style={styles.passwordContainer}>
                    <TemplateTextInput
                        placeholder={t('auth.login.passwordPlaceholder')}
                        style={styles.input}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={!passwordVisible}
                        autoCapitalize="none"
                        returnKeyType="next"
                    />
                    <TemplateTouchable
                        onPress={() => setPasswordVisible(prevState => !prevState)}
                        style={styles.passwordIcon}
                    >
                        <TemplateIcon
                            name={passwordVisible ? 'eye' : 'eye-off'}
                            size={20}
                            color={BLACK}
                            family="Ionicons"
                        />
                    </TemplateTouchable>
                </View>
                <Error show={!!error} style={styles.generalError}>
                    {error}
                </Error>
                <Error show={!!appleError} style={styles.generalError}>
                    {appleError}
                </Error>

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('auth.login.loginButton')}
                        onPress={handleLogin}
                        style={styles.button}
                        loading={loading}
                        disabled={loading || appleLoading}
                        height={56}
                        width={SCREEN_WIDTH - 40}
                        color={BLACK}
                        titleSize={17}
                    />

                    {Platform.OS === 'ios' && (
                        <View style={[styles.appleButtonWrapper, (loading || appleLoading) && styles.disabledButton]}>
                            <AppleButton
                                buttonStyle={AppleButton.Style.BLACK}
                                buttonType={AppleButton.Type.SIGN_IN}
                                style={styles.appleButton}
                                cornerRadius={28}
                                onPress={() => {
                                    if (!loading && !appleLoading) {
                                        onAppleButtonPress().then(() =>
                                            console.log(t('auth.login.appleSignInSuccess')),
                                        );
                                    }
                                }}
                            />
                        </View>
                    )}

                    <TemplateText size={15} center style={styles.signupLink} medium color="#6B7280">
                        {t('auth.login.forgotPassword')}{' '}
                        <TemplateText
                            color={ONBOARDING_BLUE}
                            size={15}
                            semiBold
                            onPress={() => navigation.navigate(FORGOT_PASSWORD)}
                        >
                            {t('auth.login.resetPassword')}
                        </TemplateText>
                    </TemplateText>

                    <TemplateText size={15} center style={styles.signupLink} medium color="#6B7280">
                        {t('auth.login.newToApp')}{' '}
                        <TemplateText
                            color={ONBOARDING_BLUE}
                            size={15}
                            semiBold
                            onPress={() => navigation.navigate(ONBOARDING)}
                        >
                            {t('auth.login.signUp')}
                        </TemplateText>
                    </TemplateText>
                </View>
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: WHITE,
    },
    contentContainerStyle: {},
    hero: {
        width: SCREEN_WIDTH,
        height: 366,
        overflow: 'hidden',
        backgroundColor: '#14101e',
    },
    heroImage: {
        width: SCREEN_WIDTH,
        height: 340,
        marginTop: 46,
    },
    heroTopFade: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 165,
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
    buttonContainer: {
        alignSelf: 'center',
        marginBottom: WRAPPER_MARGIN * 4,
    },
    button: {
        marginTop: 26,
        marginBottom: 16,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
    },
    signupLink: {
        marginBottom: 14,
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
        marginVertical: 12,
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
export default LoginScreen;
