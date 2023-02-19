import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
    BLACK,
    BLACK_10,
    BLACK_SECONDARY,
    BLUE,
    BRAND_BLUE,
    DEEP_LAVENDER, WHITE_40,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { ONBOARDING } from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import { isIOS } from '../../Utils/Platform';
import TemplateTextInput from '../../components/TemplateTextInput';
import Blob from '../../../assets/svgs/Blob';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import Error from '../../components/Error';
import HeaderIconButton from '../../components/header/HeaderButton';

const ResetPasswordScreen = ({ navigation, route }) => {
    const isUpdate = route.params?.isUpdate;
    const [email, setEmail] = useState();

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        try {
            setLoading(true);
            if (!email) {
                setError('Please enter your email address');
                setLoading(false);
                return;
            }
            await auth().sendPasswordResetEmail(email);
            Alert.alert(
                isUpdate ? 'Password Update' : 'Password Reset',
                'A password reset link has been sent to your email address',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (isUpdate) {
                                navigation.goBack();
                                return;
                            }
                            navigation.navigate(ONBOARDING);
                        },
                    },
                ],
            );
        } catch (error) {
            if (error.code === 'au-email') {
                setError('That email address is invalid!');
            }
            if (error.code === 'auth/user-not-found') {
                setError('That user does not exist!');
            }
        }
        setLoading(false);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={WHITE_40}
                    ml={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

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
                {isUpdate ? 'Update your Password!' : 'Reset your Password!' }
            </TemplateText>
            <TemplateText size={16} color={BLACK_SECONDARY} style={styles.subtitle}>
                Enter your email to continue
            </TemplateText>
            <TemplateTextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Error show={!!error} style={styles.generalError}>
                {error}
            </Error>
            <View style={styles.buttonContainer}>
                <Button
                    title="Reset Password"
                    onPress={handleResetPassword}
                    style={styles.button}
                    loading={loading}
                />
                {!isUpdate && (
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
                )}
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
export default ResetPasswordScreen;
