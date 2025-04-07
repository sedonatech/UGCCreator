import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLACK_SECONDARY,
    BLUE,
    BRAND_BLUE,
    DARK_OVERLAY,
    GREY_30,
    ONBOARDING_BLUE,
    WHITE,
    WHITE_40,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { ONBOARDING } from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import TemplateTextInput from '../../components/TemplateTextInput';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import Error from '../../components/Error';
import HeaderIconButton from '../../components/header/HeaderButton';
import TemplateBox from '../../components/TemplateBox';
import ResizedImage from '../../components/ResizedImage';

const lockImage = require('../../../assets/images/onboarding/lock.jpg');


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
                    backDropColor={BLACK_20}
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
            <TemplateBox borderRadius={20} overflow='hidden'>
                <TemplateBox style={{position: 'absolute', paddingTop: 8, alignSelf: 'center', alignItems: 'center', zIndex: 99}} backgroundColor={`${BLACK_10}`}>
                </TemplateBox>
                <ResizedImage source={lockImage} style={{height: 345, width: WRAPPED_SCREEN_WIDTH}} />
            </TemplateBox>


            <TemplateBox width={WRAPPED_SCREEN_WIDTH} mt={16}>
                <TemplateText
                    size={18}
                    bold
                    caps
                    color={BLACK}
                    style={styles.title}
                >
                    {isUpdate ? 'Update your Password!' : 'Reset your Password!' }
                </TemplateText>
                <TemplateText size={16} color={BLACK_SECONDARY} medium>
                    Enter your email to continue
                </TemplateText>
            </TemplateBox>
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
                    color={ONBOARDING_BLUE}
                />
                {!isUpdate && (
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
                )}
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    contentContainerStyle: {
        flex: 1,
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
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderColor: BLACK_10,
        borderRadius: 8,
        paddingLeft: 16,
        backgroundColor: GREY_30,
        marginTop: 16
    },
    generalError: {
        marginVertical: 10,
        alignSelf: 'center',
    },
});
export default ResetPasswordScreen;
