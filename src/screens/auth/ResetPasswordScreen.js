import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import { BLACK, BLACK_20, ONBOARDING_BLUE, WHITE } from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import Button from '../../components/Button';
import { ONBOARDING } from '../../navigation/ScreenNames';
import Wrapper from '../../components/Wrapper';
import TemplateTextInput from '../../components/TemplateTextInput';
import Error from '../../components/Error';
import HeaderIconButton from '../../components/header/HeaderButton';
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
            <View style={styles.hero}>
                <ResizedImage source={lockImage} style={{ height: 340, width: SCREEN_WIDTH }} />
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                    style={styles.heroBottomFade}
                />
            </View>

            <View style={styles.formCard}>
                <View style={styles.textBlock}>
                    <TemplateText size={24} bold color={BLACK} style={styles.title}>
                        {isUpdate ? t('auth.resetPassword.updateTitle') : t('auth.resetPassword.resetTitle')}
                    </TemplateText>
                    <TemplateText size={15} color="#6B7280" medium lineHeight={22}>
                        {t('auth.resetPassword.instruction')}
                    </TemplateText>
                </View>

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
                        height={56}
                        width={SCREEN_WIDTH - 40}
                        color={BLACK}
                        titleSize={17}
                    />
                    {!isUpdate && (
                        <TemplateText size={15} center style={styles.signupLink} medium color="#6B7280">
                            {t('auth.resetPassword.newToApp')}{' '}
                            <TemplateText
                                color={ONBOARDING_BLUE}
                                size={15}
                                semiBold
                                onPress={() => navigation.navigate(ONBOARDING)}
                            >
                                {t('auth.resetPassword.signUp')}
                            </TemplateText>
                        </TemplateText>
                    )}
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
        height: 340,
    },
    heroBottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 130,
    },
    formCard: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        marginTop: -28,
    },
    textBlock: {
        width: WRAPPED_SCREEN_WIDTH,
    },
    buttonContainer: {
        alignSelf: 'center',
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
    },
    signupLink: {
        marginBottom: 16,
    },
    title: {
        marginBottom: 8,
    },
    input: {
        height: 58,
        width: SCREEN_WIDTH - 40,
        borderWidth: 1,
        borderColor: '#E6E8EC',
        borderRadius: 18,
        paddingLeft: 18,
        backgroundColor: '#F6F7F9',
        marginTop: 18,
    },
    generalError: {
        marginVertical: 10,
        alignSelf: 'center',
    },
});
export default ResetPasswordScreen;
