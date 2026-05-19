/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import DynamicIcon from '../../components/icons/DynamicIcon';
import Button from '../../components/Button';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import { BLACK, WHITE } from '../../theme/Colors';
import { LOGIN, ONBOARDING_EDUCATION } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import BackgroundImage from '../../components/BackgroundImage';
import TemplateText from '../../components/TemplateText';
import welcomeImg from '../../../assets/images/onboarding/welcome.jpg';
import useTranslation from '../../hooks/useTranslation';
import LanguageSelector from '../../components/LanguageSelector';

const WelcomeScreen = ({ navigation }) => {
    const src = Image.resolveAssetSource(welcomeImg).uri;
    const { t } = useTranslation();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    return (
        <View style={styles.container}>
            <BackgroundImage source={{ uri: src }} width={SCREEN_WIDTH} style={styles.bgImage} />
            <LinearGradient
                colors={['rgba(10,8,25,0.0)', 'rgba(10,8,25,0.32)', 'rgba(10,8,25,0.86)']}
                locations={[0, 0.46, 1]}
                style={styles.gradient}
            />

            <SafeAreaView style={styles.safe}>
                <View style={styles.topRow}>
                    <BrandLogo height={66} width={162} color={WHITE} />
                    <TouchableOpacity
                        style={styles.languageButton}
                        activeOpacity={0.8}
                        onPress={() => setShowLanguageSelector(true)}
                    >
                        <BlurView
                            style={styles.fill}
                            blurType="light"
                            blurAmount={12}
                            reducedTransparencyFallbackColor="rgba(255,255,255,0.5)"
                        />
                        <View style={styles.glassTintStrong} />
                        <DynamicIcon name="Language" size={22} color={WHITE} />
                    </TouchableOpacity>
                </View>

                <View style={styles.bottom}>
                    <View style={styles.glassCard}>
                        <BlurView
                            style={styles.fill}
                            blurType="light"
                            blurAmount={18}
                            reducedTransparencyFallbackColor="rgba(255,255,255,0.6)"
                        />
                        <View style={styles.glassTint} />
                        <View style={styles.glassHighlight} />

                        <TemplateText center size={30} bold color={WHITE} style={styles.title}>
                            {t('onboarding.welcome.title')}
                        </TemplateText>

                        <Button
                            title={t('onboarding.welcome.getStarted')}
                            onPress={() => navigation.navigate(ONBOARDING_EDUCATION)}
                            height={56}
                            width={SCREEN_WIDTH - 88}
                            color={WHITE}
                            titleColor={BLACK}
                            titleSize={17}
                            style={styles.cta}
                        />

                        <TouchableOpacity
                            style={styles.loginRow}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate(LOGIN)}
                        >
                            <TemplateText center size={15} medium color="rgba(255,255,255,0.75)">
                                {t('onboarding.welcome.alreadyHaveAccount')}{' '}
                                <TemplateText size={15} bold color={WHITE} underLine>
                                    {t('onboarding.welcome.login')}
                                </TemplateText>
                            </TemplateText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <LanguageSelector visible={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BLACK,
    },
    bgImage: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    safe: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingTop: 6,
    },
    languageButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    bottom: {
        paddingHorizontal: 18,
        paddingBottom: 14,
    },
    glassCard: {
        borderRadius: 34,
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 26,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        alignItems: 'center',
        overflow: 'hidden',
    },
    glassTint: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.10)',
    },
    glassTintStrong: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.16)',
    },
    glassHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1.5,
        backgroundColor: 'rgba(255,255,255,0.55)',
    },
    title: {
        marginBottom: 24,
        lineHeight: 38,
    },
    cta: {
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
    },
    loginRow: {
        marginTop: 20,
    },
});

export default WelcomeScreen;
