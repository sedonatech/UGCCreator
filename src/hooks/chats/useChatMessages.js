import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
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
                createdAt: moment().format('YYYY-MM-DD HH:mm'),
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
