import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {APP, AUTH, BRANDS_STACK} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';
import Loading from '../components/Loading';
import AppStack from './app/AppStack';
import useAuthContext from '../hooks/auth/useAuthContext';
import BrandsStack from './brands/BrandsStack';
const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  const {auth} = useAuthContext();

  const loading = auth?.initializing;

  const isCreator = auth?.profile?.type === 'creator';

  const isSignedIn = !loading && !!auth?.user;

  if (loading) {
    return <Loading />;
  }

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
