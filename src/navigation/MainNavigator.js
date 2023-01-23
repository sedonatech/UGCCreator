import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import {APP, AUTH, BRANDS_STACK} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';

import AppStack from './app/AppStack';
import useAuthContext from '../hooks/auth/useAuthContext';
import BrandsStack from './brands/BrandsStack';

const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  const {auth} = useAuthContext();

  const loading = auth?.initializing;

  const isCreator = auth?.profile?.type && auth?.profile?.type === 'creator';
  const isBrand = !!auth?.profile?.type && auth?.profile?.type === 'brand';

  const isSignedIn = !loading && !!auth?.user;

  useEffect(() => {
    if (!loading || auth?.user) {
      SplashScreen.hide();
    }
  }, [loading, auth?.user]);

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isCreator && isSignedIn && <Screen name={APP} component={AppStack} />}
      {!isCreator && isSignedIn && (
        <Screen name={BRANDS_STACK} component={BrandsStack} />
      )}
      {!isSignedIn && <Screen name={AUTH} component={AuthStack} />}
    </Navigator>
  );
};

export default MainNavigator;
