import firestore from '@react-native-firebase/firestore';
import { CHAT_ROOMS } from './useChatRooms';

export const MESSAGES = 'messages';
const useChatMessages = (chatRoom) => {
    console.log('-> chatRoom', chatRoom);
    const onSendMessage = (newMessage) => {
        const formattedMessages = newMessage?.map((message) => ({
            ...message,
            createdAt: firestore.FieldValue.serverTimestamp(),
        }));
        console.log('-> formattedMessages', JSON.stringify(formattedMessages, null, 2));

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
