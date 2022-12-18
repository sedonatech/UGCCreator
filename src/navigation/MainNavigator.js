import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AUTH, HOME_STACK} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';
import HomeStack from './app/HomeStack';
import useAuthState from '../hooks/auth/useAuthState';
import Loading from '../components/Loading';
const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  const {user, initializing} = useAuthState();
  console.log('-> user', JSON.stringify(user, null, 2));

  if (initializing) {
    return <Loading />;
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <Screen name={HOME_STACK} component={HomeStack} />
      ) : (
        <Screen name={AUTH} component={AuthStack} />
      )}
    </Navigator>
  );
};

export default MainNavigator;
