import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import OffersScreen from '../../screens/app/offers/OffersScreen';
import { OFFERS } from '../ScreenNames';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const OffersStack = () => (
    <Navigator initialRouteName={OFFERS} screenOptions={SWITCH}>
        <Screen
            name={OFFERS}
            options={TRANSPARENT_HEADER}
            component={OffersScreen}
        />
    </Navigator>
);

export default OffersStack;
