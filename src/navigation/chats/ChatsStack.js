import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import { CHAT_ROOM, CHATS } from '../ScreenNames';
import ChatsScreen from '../../screens/chats/ChatsScreen';
import ChatRoomsScreen from '../../screens/chats/ChatRoomsScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ChatsStack = () => (

    <Navigator initialRouteName={CHAT_ROOM} screenOptions={SWITCH}>
        <Screen
            name={CHAT_ROOM}
            options={TRANSPARENT_HEADER}
            component={ChatRoomsScreen}
        />
        <Screen
            name={CHATS}
            options={TRANSPARENT_HEADER}
            component={ChatsScreen}
        />
    </Navigator>

);

export default ChatsStack;
