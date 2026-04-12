import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { BLACK, BLACK_10, GREY_30, ONBOARDING_BLUE, WHITE } from '../../theme/Colors';
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

const loginImage = require('../../../assets/images/onboarding/login.jpg');

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
            <TemplateBox borderRadius={20} overflow="hidden">
                <TemplateBox position="absolute" top={50} alignSelf="center" alignItems="center" zIndex={99}>
                    <BrandLogo height={58} width={282} color={WHITE} />
                </TemplateBox>
                <ResizedImage source={loginImage} style={{ height: 370, width: SCREEN_WIDTH }} />
            </TemplateBox>

            <TemplateBox width={WRAPPED_SCREEN_WIDTH} mt={20}>
                <TemplateText size={22} semiBold>
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
                    height={50}
                    width={SCREEN_WIDTH - 40}
                    color={BLACK}
                />

                {Platform.OS === 'ios' && (
                    <View style={[styles.appleButtonWrapper, (loading || appleLoading) && styles.disabledButton]}>
                        <AppleButton
                            buttonStyle={AppleButton.Style.BLACK}
                            buttonType={AppleButton.Type.SIGN_IN}
                            style={styles.appleButton}
                            onPress={() => {
                                if (!loading && !appleLoading) {
                                    onAppleButtonPress().then(() => console.log(t('auth.login.appleSignInSuccess')));
                                }
                            }}
                        />
                    </View>
                )}

                <TemplateText size={16} center style={styles.signupLink} medium>
                    {t('auth.login.forgotPassword')}{' '}
                    <TemplateText
                        color={ONBOARDING_BLUE}
                        underLine
                        size={16}
                        medium
                        onPress={() => navigation.navigate(FORGOT_PASSWORD)}
                    >
                        {t('auth.login.resetPassword')}
                    </TemplateText>
                </TemplateText>

                <TemplateText size={16} center style={styles.signupLink} medium>
                    {t('auth.login.newToApp')}{' '}
                    <TemplateText
                        color={ONBOARDING_BLUE}
                        underLine
                        size={16}
                        medium
                        onPress={() => navigation.navigate(ONBOARDING)}
                    >
                        {t('auth.login.signUp')}
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
        marginBottom: WRAPPER_MARGIN * 4,
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
        borderRadius: 26,
    },
    signupLink: {
        marginBottom: 16,
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderColor: BLACK_10,
        borderRadius: 26,
        paddingLeft: 16,
        marginTop: 16,
        backgroundColor: GREY_30,
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
        marginVertical: 16,
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
export default LoginScreen;
