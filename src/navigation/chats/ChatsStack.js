import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import { CHAT_ROOM, CHATS, SUPPORT_CHAT } from '../ScreenNames';
import ChatsScreen from '../../screens/chats/ChatsScreen';
import ChatRoomsScreen from '../../screens/chats/ChatRoomsScreen';
import SupportChatScreen from '../../screens/chats/SupportChatScreen';

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
        <Screen
            name={SUPPORT_CHAT}
            options={TRANSPARENT_HEADER}
            component={SupportChatScreen}
        />
    </Navigator>

);

export default ChatsStack;
