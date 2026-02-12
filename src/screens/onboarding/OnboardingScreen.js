import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { BLUE_500, BRAND_BLUE, DARK_OVERLAY, WHITE } from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import Button from '../../components/Button';
import { LOGIN, SIGN_UP } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import TemplateBox from '../../components/TemplateBox';
import BackgroundImage from '../../components/BackgroundImage';
import useTranslation from '../../hooks/useTranslation';

const image = require('../../../assets/images/onboarding/auth-select.jpg');

const OnboardingScreen = ({ navigation }) => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundImage source={image} width={SCREEN_WIDTH} style={styles.bgImage} />
            <TemplateBox absolute width={SCREEN_WIDTH} height={SCREEN_HEIGHT} backgroundColor={DARK_OVERLAY} />
            <BrandLogo height={115} width={282} color={WHITE} />

            <View style={styles.buttonContainer}>
                <Button
                    title={t('onboarding.selection.registerCreator')}
                    onPress={() =>
                        navigation.navigate(SIGN_UP, {
                            type: 'creator',
                        })
                    }
                    style={styles.button}
                    height={50}
                    width={SCREEN_WIDTH - 40}
                    color={BLUE_500}
                />
                <Button
                    title={t('onboarding.selection.registerBrand')}
                    onPress={() =>
                        navigation.navigate(SIGN_UP, {
                            type: 'brand',
                        })
                    }
                    style={styles.button}
                    height={50}
                    width={SCREEN_WIDTH - 40}
                />
                <TemplateText size={16} center style={styles.loginText} medium color={WHITE}>
                    {t('onboarding.selection.alreadyHaveAccount')}{' '}
                    <TemplateText color={WHITE} underLine size={16} medium onPress={() => navigation.navigate(LOGIN)}>
                        {t('onboarding.selection.login')}
                    </TemplateText>
                </TemplateText>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND_BLUE,
        alignItems: 'center',
    },
    bgImage: {
        height: SCREEN_HEIGHT,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    button: {
        marginBottom: 20,
        borderRadius: 26,
    },

    loginText: {
        marginTop: 8,
    },
});
export default OnboardingScreen;
