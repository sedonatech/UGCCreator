import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import OffersScreen from '../../screens/app/offers/OffersScreen';
import { CURRENT_PROJECT_DETAILS, OFFERS } from '../ScreenNames';
import CurrentProjectDetailsScreen from '../../screens/app/offers/CurrentProjectDetailsScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const OffersStack = () => (
    <Navigator initialRouteName={OFFERS} screenOptions={SWITCH}>
        <Screen
            name={OFFERS}
            options={TRANSPARENT_HEADER}
            component={OffersScreen}
        />
        <Screen
            name={CURRENT_PROJECT_DETAILS}
            options={TRANSPARENT_HEADER}
            component={CurrentProjectDetailsScreen}
        />
    </Navigator>
);

export default OffersStack;
