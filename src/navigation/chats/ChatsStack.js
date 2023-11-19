import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    SWITCH,
    TRANSPARENT_HEADER,
    TRANSPARENT_NO_LOGO_HEADER,
} from '../../components/header/ScreenOptions';
import {
    CHAT_ROOM, CHATS, START_SUPPOR_CHAT, SUPPORT_CHAT,
} from '../ScreenNames';
import ChatsScreen from '../../screens/chats/ChatsScreen';
import ChatRoomsScreen from '../../screens/chats/ChatRoomsScreen';
import SupportChatScreen from '../../screens/chats/SupportChatScreen';
import StartSupportChatScreen from '../../screens/chats/StartSupportChatScreen';

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
        <Screen
            name={START_SUPPOR_CHAT}
            options={TRANSPARENT_NO_LOGO_HEADER}
            component={StartSupportChatScreen}
        />
    </Navigator>

);

export default ChatsStack;
