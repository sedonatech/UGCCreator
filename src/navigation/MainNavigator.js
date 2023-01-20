import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {APP, AUTH, BRANDS_STACK} from './ScreenNames';
import {enableScreens} from 'react-native-screens';
import AuthStack from './auth/AuthStack';
import Loading from '../components/Loading';
import AppStack from './app/AppStack';
import useAuthContext from '../hooks/auth/useAuthContext';
import BrandsStack from './brands/BrandsStack';
import {StyleSheet, View} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../theme/Layout';
import Blob from '../../asssets/svgs/Blob';
import {DEEP_LAVENDER} from '../theme/Colors';
const Stack = createStackNavigator();
const {Navigator, Screen} = Stack;

enableScreens();
const MainNavigator = () => {
  const {auth} = useAuthContext();

  const loading = auth?.initializing;

  const isCreator = auth?.profile?.type && auth?.profile?.type === 'creator';
  const isBrand = !!auth?.profile?.type && auth?.profile?.type === 'brand';

  const isSignedIn = !loading && !!auth?.user;

  if (loading) {
    return (
      <View style={styles.fullScreenLoader}>
        <Blob color={DEEP_LAVENDER} top />
        <Blob right />
        <Blob color={DEEP_LAVENDER} bottom />
        <Loading />
      </View>
    );
  }
  if (!auth?.profile?.type) {
    return (
      <View style={styles.fullScreenLoader}>
        <Blob color={DEEP_LAVENDER} top />
        <Blob right />
        <Blob color={DEEP_LAVENDER} bottom />
        <Loading />
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

const styles = StyleSheet.create({
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});
export default MainNavigator;
