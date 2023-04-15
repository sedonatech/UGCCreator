import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../theme/Layout';
import { BRAND_BLUE } from '../../theme/Colors';
import { ONBOARDING_EDUCATION } from '../../navigation/ScreenNames';
import BrandLogo from '../../../assets/svgs/BrandLogo';

const WelcomeScreen = ({ navigation }) => (
    <View style={styles.container}>
        <BrandLogo height={SCREEN_HEIGHT / 2} width={SCREEN_WIDTH / 1.2} />
        <Button
            title="Get Started"
            onPress={() => {
                navigation.navigate(ONBOARDING_EDUCATION);
            }}
            style={styles.button}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BRAND_BLUE,
    },
    button: {
        position: 'absolute',
        bottom: 40,
    },
});
export default WelcomeScreen;
