import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import {APP, AUTH, BRANDS_STACK, ONBOARDING} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';

import AppStack from './app/AppStack';
import useAuthContext from '../hooks/auth/useAuthContext';
import BrandsStack from './brands/BrandsStack';
import {View} from 'react-native';
import Blob from '../../asssets/svgs/Blob';
import {BRAND_BLUE, DEEP_LAVENDER} from '../theme/Colors';
import BrandLogo from '../../asssets/svgs/BrandLogo';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../theme/Layout';
import Button from '../components/Button';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  const {auth} = useAuthContext();

  const loading = auth?.initializing;

  const isCreator = auth?.profile?.type && auth?.profile?.type === 'creator';
  const isBrand = !!auth?.profile?.type && auth?.profile?.type === 'brand';

  const isSignedIn = !loading && !!auth?.user;

  const showSplash = isSignedIn && !isCreator && !isBrand;

  useEffect(() => {
    if (!loading || auth?.user || !showSplash) {
      SplashScreen.hide();
    }
  }, [loading, auth?.user, showSplash]);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <Blob color={DEEP_LAVENDER} top />
        <Blob right />
        <Blob color={DEEP_LAVENDER} bottom />
        <BrandLogo height={SCREEN_HEIGHT / 2} width={SCREEN_WIDTH / 1.2} />
      </View>
    );
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isCreator && isSignedIn && <Screen name={APP} component={AppStack} />}
      {isBrand && isSignedIn && (
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
