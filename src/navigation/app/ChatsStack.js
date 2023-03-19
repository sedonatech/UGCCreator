import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import { CHATS } from '../ScreenNames';
import ChatsScreen from '../../screens/chats/ChatsScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ChatsStack = () => (
    <Navigator initialRouteName={CHATS} screenOptions={SWITCH}>
        <Screen
            name={CHATS}
            options={TRANSPARENT_HEADER}
            component={ChatsScreen}
        />
    </Navigator>
);

export default ChatsStack;
