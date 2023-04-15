import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
    BLUE,
    BRAND_BLUE,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import {
    HEADER_MARGIN, SCREEN_WIDTH,
} from '../../theme/Layout';
import Button from '../../components/Button';
import { LOGIN, SIGN_UP } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import TemplateBox from '../../components/TemplateBox';

const OnboardingScreen = ({ navigation }) => (
    <View style={styles.container}>
        <TemplateBox height={HEADER_MARGIN} />
        <BrandLogo height={300} width={SCREEN_WIDTH / 1.4} />

        <View style={styles.buttonContainer}>
            <Button
                title="Register as a Creator"
                onPress={() => navigation.navigate(SIGN_UP, {
                    type: 'creator',
                })}
                style={styles.button}
            />
            <Button
                title="Register as a Brand"
                onPress={() => navigation.navigate(SIGN_UP, {
                    type: 'brand',
                })}
                style={styles.button}
            />
            <TemplateText italic size={16} center style={styles.loginText} medium>
                Already joined?
                {' '}

                <TemplateText
                    color={BLUE}
                    underLine
                    size={16}
                    medium
                    onPress={() => navigation.navigate(LOGIN)}
                >
                    Login
                </TemplateText>
            </TemplateText>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND_BLUE,
        alignItems: 'center',
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
