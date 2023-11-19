import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import { useState } from 'react';
import { CHAT_ROOMS } from './useChatRooms';
import useNotifications from '../notifications/useNotifications';
import { CHATS } from '../../navigation/ScreenNames';

export const MESSAGES = 'messages';

export const SUPPORT_CHAT_MESSAGES = 'supportChatMessages';

const useChatMessages = () => {
    const { sendNotification } = useNotifications();

    const onSendMessage = async (newMessage, chatRoom, fcmToken) => {
        try {
            const formattedMessages = newMessage?.map((message) => ({
                ...message,
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
            }));

            await firestore()
                .collection(CHAT_ROOMS)
                .doc(chatRoom?.id)
                .collection(MESSAGES)
                .add(formattedMessages[0]);

            // send notification
            await sendNotification(
                fcmToken,
                `New message from ${chatRoom?.name}`,
                formattedMessages[0]?.text,
                {
                    type: 'chats',
                    screen: CHATS,
                },
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Send  message to support channel
    const onSendSupportMessage = async (newMessage) => {
        try {
            const formattedMessages = newMessage?.map((message) => ({
                ...message,
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
            }));

            await firestore()
                .collection(SUPPORT_CHAT_MESSAGES)
                .add(formattedMessages[0]);
        } catch (error) {
            console.log(error);
        }
    };

    // set support messages to state
    const [supportMessages, setSupportMessages] = useState();
    // Get support messages
    const getSupportMessages = async () => {
        try {
            const messages = await firestore()
                .collection(SUPPORT_CHAT_MESSAGES)
                .orderBy('createdAt', 'desc')
                .get();

            const messagesArray = messages.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            if (messagesArray.length > 0) {
                setSupportMessages(messagesArray);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return {
        onSendMessage,
        onSendSupportMessage,
        getSupportMessages,
        supportMessages,
    };
};

export default useChatMessages;
