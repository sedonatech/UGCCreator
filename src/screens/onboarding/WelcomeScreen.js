/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import DynamicIcon from '../../components/icons/DynamicIcon';
import Button from '../../components/Button';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import { DARK_OVERLAY, WHITE } from '../../theme/Colors';
import { LOGIN, ONBOARDING_EDUCATION } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import BackgroundImage from '../../components/BackgroundImage';
import TemplateBox from '../../components/TemplateBox';
import TemplateText from '../../components/TemplateText';
import welcomeImg from '../../../assets/images/onboarding/welcome.jpg';
import useTranslation from '../../hooks/useTranslation';
import LanguageSelector from '../../components/LanguageSelector';

const WelcomeScreen = ({ navigation }) => {
    const src = Image.resolveAssetSource(welcomeImg).uri;
    const { t } = useTranslation();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundImage source={{ uri: src }} width={SCREEN_WIDTH} style={styles.bgImage} />
            <TemplateBox absolute width={SCREEN_WIDTH} height={SCREEN_HEIGHT} backgroundColor={DARK_OVERLAY} />

            <TouchableOpacity style={styles.languageButton} onPress={() => setShowLanguageSelector(true)}>
                <DynamicIcon name="Language" size={28} color={WHITE} />
            </TouchableOpacity>
            <BrandLogo height={115} width={282} color={WHITE} />

            <View style={styles.buttonContainer}>
                <TemplateBox center mb={20} selfCenter>
                    <TemplateText center size={32} medium color={WHITE}>
                        {t('onboarding.welcome.title')}
                    </TemplateText>
                </TemplateBox>
                <Button
                    title={t('onboarding.welcome.getStarted')}
                    onPress={() => {
                        navigation.navigate(ONBOARDING_EDUCATION);
                    }}
                    height={50}
                    width={SCREEN_WIDTH - 40}
                    style={{ borderRadius: 26 }}
                />
                <TemplateBox center mb={20} selfCenter mt={20} onPress={() => navigation.navigate(LOGIN)}>
                    <TemplateText center size={16} medium color={WHITE}>
                        {t('onboarding.welcome.alreadyHaveAccount')}{' '}
                        <TemplateText underLine center size={16} medium color={WHITE}>
                            {t('onboarding.welcome.login')}
                        </TemplateText>
                    </TemplateText>
                </TemplateBox>
            </View>

            <LanguageSelector visible={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: '/center',
        alignItems: 'center',
        // backgroundColor: BRAND_BLUE,
    },
    bgImage: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
    },
    languageButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
    },
});
export default WelcomeScreen;
