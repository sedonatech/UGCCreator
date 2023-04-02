import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { CHAT_ROOMS } from './useChatRooms';

export const MESSAGES = 'messages';
const useChatMessages = () => {
    const onSendMessage = (newMessage, chatRoom) => {
        const formattedMessages = newMessage?.map((message) => ({
            ...message,
            createdAt: moment().format('YYYY-MM-DD HH:mm'),
        }));

        firestore()
            .collection(CHAT_ROOMS)
            .doc(chatRoom?.id)
            .collection(MESSAGES)
            .add(formattedMessages[0]);
    };

    return {
        onSendMessage,
    };
};

export default useChatMessages;
