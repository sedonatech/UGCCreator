import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {APP, AUTH} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';
import useAuthState from '../hooks/auth/useAuthState';
import Loading from '../components/Loading';
import AppStack from './app/AppStack';
const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  const {user, initializing} = useAuthState();

  if (initializing) {
    return <Loading />;
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <Screen name={APP} component={AppStack} />
      ) : (
        <Screen name={AUTH} component={AuthStack} />
      )}
    </Navigator>
  );
};

export default MainNavigator;
