/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Video from 'react-native-video';
import { BLACK, WHITE } from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import Button from '../../components/Button';
import { LOGIN, SIGN_UP } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import useTranslation from '../../hooks/useTranslation';

const bgVideo = require('../../../assets/images/onboarding/onboarding-bg.mp4');

const OnboardingScreen = ({ navigation }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Video
                source={bgVideo}
                style={styles.bgVideo}
                resizeMode="cover"
                repeat
                muted
                paused={false}
                playInBackground={false}
                playWhenInactive={false}
                disableFocus
                controls={false}
            />
            <LinearGradient
                colors={['rgba(10,8,25,0.0)', 'rgba(10,8,25,0.32)', 'rgba(10,8,25,0.88)']}
                locations={[0, 0.44, 1]}
                style={styles.gradient}
            />

            <SafeAreaView style={styles.safe}>
                <View style={styles.topRow}>
                    <BrandLogo height={66} width={162} color={WHITE} />
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

                        <Button
                            title={t('onboarding.selection.registerCreator')}
                            onPress={() => navigation.navigate(SIGN_UP, { type: 'creator' })}
                            height={56}
                            width={SCREEN_WIDTH - 88}
                            color={WHITE}
                            titleColor={BLACK}
                            titleSize={16}
                            style={styles.primaryBtn}
                        />
                        <Button
                            title={t('onboarding.selection.registerBrand')}
                            onPress={() => navigation.navigate(SIGN_UP, { type: 'brand' })}
                            height={56}
                            width={SCREEN_WIDTH - 88}
                            color="transparent"
                            titleColor={WHITE}
                            titleSize={16}
                            style={styles.outlineBtn}
                        />

                        <TouchableOpacity
                            style={styles.loginRow}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate(LOGIN)}
                        >
                            <TemplateText center size={15} medium color="rgba(255,255,255,0.75)">
                                {t('onboarding.selection.alreadyHaveAccount')}{' '}
                                <TemplateText size={15} bold color={WHITE} underLine>
                                    {t('onboarding.selection.login')}
                                </TemplateText>
                            </TemplateText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BLACK,
    },
    bgVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
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
        paddingHorizontal: 22,
        paddingTop: 6,
    },
    bottom: {
        paddingHorizontal: 18,
        paddingBottom: 14,
    },
    glassCard: {
        borderRadius: 34,
        paddingHorizontal: 24,
        paddingTop: 26,
        paddingBottom: 24,
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
    glassHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1.5,
        backgroundColor: 'rgba(255,255,255,0.55)',
    },
    primaryBtn: {
        borderRadius: 28,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
    },
    outlineBtn: {
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    loginRow: {
        marginTop: 20,
    },
});

export default OnboardingScreen;
