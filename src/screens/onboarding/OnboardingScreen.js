import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
    BRAND_BLUE,
    DARK_OVERLAY,
    ONBOARDING_BLUE,
    WHITE,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import {
     SCREEN_HEIGHT, SCREEN_WIDTH,
} from '../../theme/Layout';
import Button from '../../components/Button';
import { LOGIN, SIGN_UP } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import TemplateBox from '../../components/TemplateBox';
import BackgroundImage from '../../components/BackgroundImage';

const image = require('../../../assets/images/onboarding/auth-select.jpg');

const OnboardingScreen = ({ navigation }) => (
    <SafeAreaView style={styles.container}>
        <BackgroundImage
            source={image}
            width={SCREEN_WIDTH}
            style={styles.bgImage}
        />
        <TemplateBox absolute width={SCREEN_WIDTH} height={SCREEN_HEIGHT} backgroundColor={DARK_OVERLAY} />
        <BrandLogo height={115} width={282} color={WHITE} />

        <View style={styles.buttonContainer}>
            <Button
                title="Register as a Creator"
                onPress={() => navigation.navigate(SIGN_UP, {
                    type: 'creator',
                })}
                style={styles.button}
                color={ONBOARDING_BLUE}
            />
            <Button
                title="Register as a Brand"
                onPress={() => navigation.navigate(SIGN_UP, {
                    type: 'brand',
                })}
                style={styles.button}
                color={WHITE}
                titleColor={ONBOARDING_BLUE}
            />
            <TemplateText size={16} center style={styles.loginText} medium color={WHITE}>
                Already have an account?
                {' '}
                <TemplateText
                    color={WHITE}
                    underLine
                    size={16}
                    medium
                    onPress={() => navigation.navigate(LOGIN)}
                >
                    Login
                </TemplateText>
            </TemplateText>
        </View>
    </SafeAreaView>
);

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
    },
    loginText: {
        marginTop: 8,
    },
});
export default OnboardingScreen;
