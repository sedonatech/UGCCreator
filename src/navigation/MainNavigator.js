import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { View } from 'react-native';
import {
    APP, AUTH, BRANDS_STACK, SUBSCRIPTION_STACK,
} from './ScreenNames';
import AuthStack from './auth/AuthStack';

import AppStack from './app/AppStack';
import useAuthContext from '../hooks/auth/useAuthContext';
import BrandsStack from './brands/BrandsStack';
import { BRAND_BLUE } from '../theme/Colors';
import BrandLogo from '../../assets/svgs/BrandLogo';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../theme/Layout';
import useHasSubscription from '../screens/subscriptions/useHasSubscription';
import SubscriptionStack from './subscription/SubscriptionStack';
import useNotificationInteraction from '../hooks/notifications/useNotificationInteraction';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

// enableScreens();
// enableFreeze(true);

const MainNavigator = () => {
    const { auth } = useAuthContext();

    const loading = auth?.initializing;

    const isCreator = auth?.profile?.type && auth?.profile?.type === 'creator';

    const isBrand = !!auth?.profile?.type && auth?.profile?.type === 'brand';

    const isSignedIn = !loading && !!auth?.user;

    const showSplash = !isCreator && !isBrand;

    const { hasSubscription } = useHasSubscription();

    useNotificationInteraction();

    useEffect(() => {
        if (!loading || auth?.user || !showSplash) {
            SplashScreen.hide();
        }
    }, [loading, auth?.user, showSplash]);

    if (showSplash && isSignedIn) {
        return (
            <View style={styles.container}>
                <BrandLogo height={SCREEN_HEIGHT / 2} width={SCREEN_WIDTH / 1.2} />
            </View>
        );
    }

    return (
        <Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {isCreator
              && isSignedIn
              && hasSubscription
              && (
                  <Screen name={APP} component={AppStack} />
              )}
            {isCreator
              && isSignedIn
              && !hasSubscription
              && (
                  <Screen name={SUBSCRIPTION_STACK} component={SubscriptionStack} />
              )}
            {!isCreator && isSignedIn && (
                <Screen name={BRANDS_STACK} component={BrandsStack} />
            )}
            {!isSignedIn && <Screen name={AUTH} component={AuthStack} />}
        </Navigator>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BRAND_BLUE,
    },
};

export default MainNavigator;
