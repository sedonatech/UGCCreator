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
import { SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { ONBOARDING } from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import { isAndroid, isIOS } from '../../Utils/Platform';
import TemplateTextInput from '../../components/TemplateTextInput';
import Blob from '../../../assets/svgs/Blob';
import BrandLogo from '../../../assets/svgs/BrandLogo';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState();

    const [password, setPassword] = useState();

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await auth().signInWithEmailAndPassword(email, password);
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
            keyboard
        >
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
            />
            <TemplateTextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                autoCapitalize="none"
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Login"
                    onPress={handleLogin}
                    style={styles.button}
                    loading={loading}
                />

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
        backgroundColor: BRAND_BLUE,
    },
    textContainer: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
        marginTop: WRAPPER_MARGIN,
    },
    logo: {},
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
});
export default LoginScreen;
