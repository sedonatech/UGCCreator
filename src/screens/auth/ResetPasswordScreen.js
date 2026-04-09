import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { BLACK, BLACK_10, BLACK_20, BLACK_SECONDARY, GREY_30, ONBOARDING_BLUE } from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { ONBOARDING } from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import TemplateTextInput from '../../components/TemplateTextInput';
import Error from '../../components/Error';
import HeaderIconButton from '../../components/header/HeaderButton';
import TemplateBox from '../../components/TemplateBox';
import ResizedImage from '../../components/ResizedImage';
import useTranslation from '../../hooks/useTranslation';

const lockImage = require('../../../assets/images/onboarding/lock.jpg');

const ResetPasswordScreen = ({ navigation, route }) => {
    const isUpdate = route.params?.isUpdate;
    const { t } = useTranslation();
    const [email, setEmail] = useState();

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        try {
            setLoading(true);
            if (!email) {
                setError(t('auth.resetPassword.errors.emptyEmail'));
                setLoading(false);
                return;
            }
            await auth().sendPasswordResetEmail(email);
            Alert.alert(
                isUpdate ? t('auth.resetPassword.alertUpdateTitle') : t('auth.resetPassword.alertResetTitle'),
                t('auth.resetPassword.successMessage'),
                [
                    {
                        text: t('auth.resetPassword.okButton'),
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
        } catch (err) {
            if (err.code === 'au-email') {
                setError(t('auth.resetPassword.errors.invalidEmail'));
            }
            if (err.code === 'auth/user-not-found') {
                setError(t('auth.resetPassword.errors.userNotFound'));
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
        <Wrapper contentContainerStyle={styles.contentContainerStyle} style={styles.container} keyboard>
            <TemplateBox borderRadius={20} overflow="hidden">
                <TemplateBox
                    position="absolute"
                    pt={8}
                    alignSelf="center"
                    alignItems="center"
                    zIndex={99}
                    backgroundColor={BLACK_10}
                />
                <ResizedImage source={lockImage} style={{ height: 380, width: SCREEN_WIDTH }} />
            </TemplateBox>

            <TemplateBox width={WRAPPED_SCREEN_WIDTH} mt={16}>
                <TemplateText size={18} bold caps color={BLACK} style={styles.title}>
                    {isUpdate ? t('auth.resetPassword.updateTitle') : t('auth.resetPassword.resetTitle')}
                </TemplateText>
                <TemplateText size={16} color={BLACK_SECONDARY} medium>
                    {t('auth.resetPassword.instruction')}
                </TemplateText>
            </TemplateBox>
            <TemplateTextInput
                placeholder={t('auth.resetPassword.emailPlaceholder')}
                style={styles.input}
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Error show={!!error} style={styles.generalError}>
                {error}
            </Error>
            <View style={styles.buttonContainer}>
                <Button
                    title={t('auth.resetPassword.resetButton')}
                    onPress={handleResetPassword}
                    style={styles.button}
                    loading={loading}
                    height={50}
                    width={SCREEN_WIDTH - 40}
                    color={BLACK}
                />
                {!isUpdate && (
                    <TemplateText size={16} center style={styles.signupLink} medium>
                        {t('auth.resetPassword.newToApp')}{' '}
                        <TemplateText
                            color={ONBOARDING_BLUE}
                            underLine
                            size={16}
                            medium
                            onPress={() => navigation.navigate(ONBOARDING)}
                        >
                            {t('auth.resetPassword.signUp')}
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
    contentContainerStyle: {},
    buttonContainer: {
        alignSelf: 'center',
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
        borderRadius: 26,
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
        borderRadius: 26,
        paddingLeft: 16,
        backgroundColor: GREY_30,
        marginTop: 16,
    },
    generalError: {
        marginVertical: 10,
        alignSelf: 'center',
    },
});
export default ResetPasswordScreen;
