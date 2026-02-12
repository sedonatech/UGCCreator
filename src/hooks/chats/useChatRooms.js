import { useState } from 'react';
import {
    getFirestore,
    collection,
    doc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    deleteDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import useAuthContext from '../auth/useAuthContext';
import { CHATS_STACK } from '../../navigation/ScreenNames';

export const CHAT_ROOMS = 'chatRooms';

const useChatRooms = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    const [deleteChatRoomLoading, setDeleteChatRoomLoading] = useState(false);

    const { auth } = useAuthContext();

    const userId = auth?.profile?.id;

    const isCreator = auth?.profile?.type === 'creator';

    const [chatRoomCreated, setChatRoomCreated] = useState(false);

    const createChatRoom = async (name, creatorId, brandId, creatorFCMToken, brandFCMToken) => {
        try {
            setLoading(true);
            const db = getFirestore();
            if (!creatorFCMToken || !brandFCMToken || !creatorId || !brandId || !name) {
                Alert.alert(
                    t('chats.alerts.userNotAvailable.title'),
                    t('chats.alerts.userNotAvailable.message'),
                    [
                        {
                            text: t('common.buttons.ok'),
                            onPress: () => {},
                        },
                    ],
                    { cancelable: false },
                );
                return;
            }
            // Check if the chat room already exists, extend to handle creator to creator chat
            const chatRoomsRef = collection(db, CHAT_ROOMS);
            const brandToCreatorQuery = query(
                chatRoomsRef,
                where('brandId', '==', brandId),
                where('creatorId', '==', creatorId),
            );
            const creatorToCreatorQuery = query(
                chatRoomsRef,
                where('brandId', '==', creatorId),
                where('creatorId', '==', brandId),
            );
            const foundBrandToCreatorChat = await getDocs(brandToCreatorQuery);
            const foundCreatorToCreatorChat = await getDocs(creatorToCreatorQuery);
            const existingChatRoom = foundBrandToCreatorChat?.docs?.length || foundCreatorToCreatorChat?.docs?.length;
            if (existingChatRoom) {
                Alert.alert(
                    t('chats.alerts.conversationExists.title'),
                    t('chats.alerts.conversationExists.message'),
                    [
                        {
                            text: t('common.buttons.ok'),
                            onPress: () => navigation.navigate(CHATS_STACK),
                        },
                    ],
                    { cancelable: false },
                );
                return;
            }
            const response = await addDoc(chatRoomsRef, {
                name,
                creatorId,
                brandId,
                createdAt: serverTimestamp(),
                creatorFCMToken,
                brandFCMToken,
                lastMessageTimestamp: serverTimestamp(),
            });
            if (response) {
                setChatRoomCreated(true);
                Alert.alert(
                    t('chats.alerts.conversationStarted.title'),
                    t('chats.alerts.conversationStarted.message'),
                    [
                        {
                            text: t('common.buttons.ok'),
                            onPress: () => navigation.navigate(CHATS_STACK),
                        },
                    ],
                    { cancelable: false },
                );
            }
        } catch (error) {
            console.log('[CREATE CHAT ROOM ERROR]', error);
            if (error.message) {
                Alert.alert(
                    t('chats.alerts.userNotAvailable.title'),
                    t('chats.alerts.userNotAvailable.message'),
                    [
                        {
                            text: t('common.buttons.ok'),
                            onPress: () => {},
                        },
                    ],
                    { cancelable: false },
                );
            }
        }
    };

    // Delete chat room
    const deleteChatRoom = async chatRoomId => {
        try {
            setDeleteChatRoomLoading(true);
            const db = getFirestore();
            const chatRoomRef = doc(db, CHAT_ROOMS, chatRoomId);
            await deleteDoc(chatRoomRef);
        } catch (error) {
            console.log('[DELETE CHAT ROOM ERROR]', error);
        }
        setDeleteChatRoomLoading(false);
    };

    const fetchUnreadCountInLatestChatRoom = async () => {
        try {
            const db = getFirestore();
            const chatRoomsRef = collection(db, CHAT_ROOMS);
            const chatRoomQuery = query(
                chatRoomsRef,
                where(isCreator ? 'creatorId' : 'brandId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(1),
            );
            const chatRoomSnapshot = await getDocs(chatRoomQuery);
            const latestRoom = chatRoomSnapshot.docs[0];
            if (!latestRoom) {
                console.log('No chat room found');
                return 0;
            }
            const roomId = latestRoom.id;
            const messagesRef = collection(db, CHAT_ROOMS, roomId, 'messages');
            const messagesQuery = query(messagesRef, where('read', '==', false));
            const messagesSnapshot = await getDocs(messagesQuery);
            const unreadMessages = messagesSnapshot.docs
                .map(messageDoc => ({ id: messageDoc.id, ...messageDoc.data() }))
                .filter(message => message.user?._id !== userId);
            return unreadMessages.length;
        } catch (error) {
            console.log('[UNREAD MESSAGE CHECK ERROR]', error);
        }
        return 0;
    };

    return {
        loading,
        createChatRoom,
        chatRoomCreated,
        deleteChatRoom,
        deleteChatRoomLoading,
        fetchUnreadCountInLatestChatRoom,
    };
};

export default useChatRooms;
