import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {
    BLACK,
    BLACK_10,
    DARK_OVERLAY,
    GREY_30,
    ONBOARDING_BLUE,
    WHITE,
} from '../../theme/Colors';
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

const loginImage = require('../../../assets/images/onboarding/login.jpg');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState();

    const [password, setPassword] = useState();

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const { updateProfile, getProfile } = useProfile();

    const handleLogin = async () => {
        setLoading(true);
        try {
            if (error) {
                setError(null);
            }
            await auth().signInWithEmailAndPassword(email, password);
            const profile = await getProfile(auth().currentUser.uid);
            const token = await messaging().getToken();

            const data = token ? { lastLoginTime: new Date().toISOString(), token }
                : { lastLoginTime: new Date().toISOString() };
            await updateProfile(data, profile?.id);
            // eslint-disable-next-line @typescript-eslint/no-shadow
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                setEmail('That email address is invalid!');
            }
            if (error.code === 'auth/wrong-password') {
                setError('That password is invalid!');
            }
            if (error.code === 'auth/user-not-found') {
                setError('That user does not exist!');
            }
        }
        setLoading(false);
    };

    return (
        <Wrapper
            contentContainerStyle={styles.contentContainerStyle}
            keyboard
        >
            <TemplateBox borderRadius={20} overflow="hidden">
                <TemplateBox
                    style={{
                        position: 'absolute', paddingTop: 8, alignSelf: 'center', alignItems: 'center', zIndex: 99,
                    }}
                    backgroundColor={DARK_OVERLAY}
                >
                    <BrandLogo height={58} width={282} color={WHITE} />
                </TemplateBox>
                <ResizedImage source={loginImage} style={{ height: 345, width: WRAPPED_SCREEN_WIDTH }} />
            </TemplateBox>

            <TemplateBox width={WRAPPED_SCREEN_WIDTH} mt={20}>
                <TemplateText
                    size={18}
                    medium
                    color={ONBOARDING_BLUE}
                >
                    Welcome back!
                </TemplateText>
            </TemplateBox>
            <TemplateTextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
            />
            <View style={styles.passwordContainer}>
                <TemplateTextInput
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    returnKeyType="next"
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
            <Error show={!!error} style={styles.generalError}>
                {error}
            </Error>
            <View style={styles.buttonContainer}>
                <Button
                    title="Login"
                    onPress={handleLogin}
                    style={styles.button}
                    loading={loading}
                    color={ONBOARDING_BLUE}
                />
                <TemplateText size={16} center style={styles.signupLink} medium>
                    Forgot you password?
                    {' '}

                    <TemplateText
                        color={ONBOARDING_BLUE}
                        underLine
                        size={16}
                        medium
                        onPress={() => navigation.navigate(FORGOT_PASSWORD)}
                    >
                        Reset Password
                    </TemplateText>
                </TemplateText>

                <TemplateText size={16} center style={styles.signupLink} medium>
                    New to the UGC creator app?
                    {' '}
                    <TemplateText
                        color={ONBOARDING_BLUE}
                        underLine
                        size={16}
                        medium
                        onPress={() => navigation.navigate(ONBOARDING)}
                    >
                        Sign Up
                    </TemplateText>
                </TemplateText>
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    contentContainerStyle: {
        flex: 1,
        paddingTop: 40,
    },
    buttonContainer: {
        alignSelf: 'center',
        marginBottom: WRAPPER_MARGIN * 4,
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
    },
    signupLink: {
        marginBottom: 16,
    },
    title: {
        marginBottom: WRAPPER_MARGIN,

    },

    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderColor: BLACK_10,
        borderRadius: 8,
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
});
export default LoginScreen;
