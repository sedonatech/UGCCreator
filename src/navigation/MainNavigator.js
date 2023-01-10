import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {APP, AUTH} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';
import Loading from '../components/Loading';
import AppStack from './app/AppStack';
import useAuthContext from '../hooks/auth/useAuthContext';
const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  const {auth} = useAuthContext();

  if (auth?.initializing) {
    return <Loading />;
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {auth?.user ? (
        <Screen name={APP} component={AppStack} />
      ) : (
        <Screen name={AUTH} component={AuthStack} />
      )}
    </Navigator>
  );
};

export default MainNavigator;
