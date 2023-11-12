import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns'
import { CHAT_ROOMS } from './useChatRooms';
import useNotifications from '../notifications/useNotifications';
import { CHATS } from '../../navigation/ScreenNames';

export const MESSAGES = 'messages';
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

    return {
        onSendMessage,
    };
};

export default useChatMessages;
