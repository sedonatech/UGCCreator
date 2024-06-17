import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { CHAT_ROOMS } from './useChatRooms';
import useNotifications from '../notifications/useNotifications';
import { CHATS } from '../../navigation/ScreenNames';
import useAuthContext from '../auth/useAuthContext';

export const MESSAGES = 'messages';

export const SUPPORT_CHAT_MESSAGES = 'supportChatMessages';

const useChatMessages = (selectedChatRoomId) => {
    const { sendNotification } = useNotifications();
    const { auth } = useAuthContext();

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const onSendMessage = async (newMessage, chatRoom, fcmToken) => {
        // try {
        //     const formattedMessages = newMessage?.map((message) => ({
        //         ...message,
        //         read: false,
        //         sender: message?.user?.name,
        //         createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
        //     }));
        //     await firestore()
        //         .collection(CHAT_ROOMS)
        //         .doc(chatRoom?.id)
        //         .collection(MESSAGES)
        //         .add(formattedMessages[0]);

        //     // send notification
        //     await sendNotification(
        //         fcmToken,
        //         `New message from ${chatRoom?.name}`,
        //         formattedMessages[0]?.text,
        //         {
        //             type: 'chats',
        //             screen: CHATS,
        //         },
        //     );
        // } catch (error) {
        //     console.log(error);
        // }
    };

    // Send  message to support channel
    const onSendSupportMessage = async (newMessage) => {
        // try {
        //     const formattedMessages = newMessage?.map((message) => ({
        //         ...message,
        //         createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
        //     }));

        //     await firestore()
        //         .collection(SUPPORT_CHAT_MESSAGES)
        //         .add(formattedMessages[0]);
        // } catch (error) {
        //     console.log(error);
        // }
    };

    // set support messages to state
    const [supportMessages, setSupportMessages] = useState();
    // Get support messages
    const getSupportMessages = async () => {
        // try {
        //     const messagesResults = await firestore()
        //         .collection(SUPPORT_CHAT_MESSAGES)
        //         .orderBy('createdAt', 'desc')
        //         .get();

        //     const messagesArray = messagesResults.docs.map((doc) => ({
        //         ...doc.data(),
        //         id: doc.id,
        //     }));

        //     if (messagesArray.length > 0) {
        //         setSupportMessages(messagesArray);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    };

    useEffect(() => {
        // if (!selectedChatRoomId) return () => {};
        // const unsubscribe = firestore()
        //     .collection(CHAT_ROOMS)
        //     .doc(selectedChatRoomId)
        //     .collection(MESSAGES)
        //     .where('read', '==', false)
        //     .where('user._id', '!=', auth?.profile?.id)
        //     .onSnapshot((snapshot) => {
        //         const newMessages = snapshot?.docs?.map((doc) => ({
        //             ...doc?.data(),
        //             id: doc?.id,
        //         }));
        //         setUnreadMessagesCount(newMessages?.length);
        //         // Set new unread messages
        //         // setUnreadMessagesCount(
        //         //     newMessages?.filter((message) => !message?.read)?.length,
        //         // );

        //         console.log(JSON.stringify(newMessages, null, 2));
        //     });

        // return unsubscribe;
    }, [selectedChatRoomId]);

    return {
        onSendMessage,
        onSendSupportMessage,
        getSupportMessages,
        supportMessages,
        unreadMessagesCount,
    };
};

export default useChatMessages;
