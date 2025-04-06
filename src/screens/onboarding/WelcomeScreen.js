import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Button from '../../components/Button';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import {
    DARK_OVERLAY, ONBOARDING_BLUE, WHITE,
} from '../../theme/Colors';
import { LOGIN, ONBOARDING_EDUCATION } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import BackgroundImage from '../../components/BackgroundImage';
import TemplateBox from '../../components/TemplateBox';
import TemplateText from '../../components/TemplateText';

const welcomeImage = require('../../../assets/images/onboarding/welcome.jpg');

const WelcomeScreen = ({ navigation }) => (
    <SafeAreaView style={styles.container}>
        <BackgroundImage
            source={welcomeImage}
            width={SCREEN_WIDTH}
            style={styles.bgImage}
        />
        <TemplateBox absolute width={SCREEN_WIDTH} height={SCREEN_HEIGHT} backgroundColor={DARK_OVERLAY} />
        <BrandLogo height={115} width={282} color={WHITE} />

        <View style={styles.button}>
            <TemplateBox center mb={20} selfCenter>
                <TemplateText center size={32} medium color={WHITE}>
                    {'Welcome to\nUGCCreatorApp'}
                </TemplateText>
            </TemplateBox>
            <Button
                title="Get Started"
                onPress={() => {
                    navigation.navigate(ONBOARDING_EDUCATION);
                }}
                color={ONBOARDING_BLUE}
            />
            <TemplateBox center mb={20} selfCenter mt={20} onPress={() => navigation.navigate(LOGIN)}>
                <TemplateText center size={16} medium color={WHITE}>
                    Already have an account ?
                    {' '}
                    <TemplateText underLine center size={16} medium color={WHITE}>Log in</TemplateText>
                </TemplateText>
            </TemplateBox>
        </View>
    </SafeAreaView>
);

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
    button: {
        position: 'absolute',
        bottom: 40,
    },
});
export default WelcomeScreen;
