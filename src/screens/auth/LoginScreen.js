import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
    BLACK,
    BLACK_10,
    BLACK_SECONDARY,
    BLUE,
    BRAND_BLUE,
    DEEP_LAVENDER,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { FORGOT_PASSWORD, ONBOARDING } from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import { isIOS } from '../../Utils/Platform';
import TemplateTextInput from '../../components/TemplateTextInput';
import Blob from '../../../assets/svgs/Blob';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import Error from '../../components/Error';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState();

    const [password, setPassword] = useState();

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);
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
            style={styles.container}
            keyboard
        >
            <BrandLogo height={300} width={SCREEN_WIDTH / 1.4} />
            <Blob color={DEEP_LAVENDER} top />
            <Blob right />
            <Blob color={DEEP_LAVENDER} bottom />

            <TemplateText
                size={18}
                bold
                caps
                center
                color={BLACK}
                style={styles.title}
            >
                Welcome back!
            </TemplateText>
            <TemplateText size={16} color={BLACK_SECONDARY} style={styles.subtitle}>
                Enter your email and password to continue
            </TemplateText>
            <TemplateTextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
            />
            <TemplateTextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="next"
            />
            <Error show={!!error} style={styles.generalError}>
                {error}
            </Error>
            <View style={styles.buttonContainer}>
                <Button
                    title="Login"
                    onPress={handleLogin}
                    style={styles.button}
                    loading={loading}
                />
                <TemplateText size={16} center italic style={styles.signupLink}>
                    Forgot you password?
                    {' '}

                    <TemplateText
                        color={BLUE}
                        underLine
                        size={16}
                        onPress={() => navigation.navigate(FORGOT_PASSWORD)}
                    >
                        Reset Password
                    </TemplateText>
                </TemplateText>

                <TemplateText size={16} center italic style={styles.signupLink}>
                    New to the UGC creator app?
                    {' '}

                    <TemplateText
                        color={BLUE}
                        underLine
                        size={16}
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
        alignItems: 'center',
        backgroundColor: BRAND_BLUE,
    },
    contentContainerStyle: {
        flex: 1,
        backgroundColor: BRAND_BLUE,
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
        fontFamily: isIOS ? 'Baskerville-BoldItalic' : 'monospace',
    },
    subtitle: {
        fontFamily: isIOS ? 'Baskerville-BoldItalic' : 'monospace',
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderColor: BLACK_10,
        borderRadius: 8,
        paddingLeft: 16,
        marginTop: WRAPPER_MARGIN * 2,
    },
    generalError: {
        marginVertical: 10,
        alignSelf: 'center',
    },
});
export default LoginScreen;
