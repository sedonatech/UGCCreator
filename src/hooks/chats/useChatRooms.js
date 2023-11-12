import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthContext from '../auth/useAuthContext';
import { CHATS_STACK } from '../../navigation/ScreenNames';

export const CHAT_ROOMS = 'chatRooms';

const useChatRooms = () => {
    const navigation = useNavigation();
    const [chatRooms, setChatRooms] = useState([]);

    const [loading, setLoading] = useState(false);

    const [fetchingChatRooms, setFetchingChatRooms] = useState(false);

    const { auth } = useAuthContext();

    const userId = auth?.profile?.id;

    const isCreator = auth?.profile?.type === 'creator';

    const [chatRoomCreated, setChatRoomCreated] = useState(false);

    const createChatRoom = async (name, creatorId, brandId, creatorFCMToken, brandFCMToken) => {
        try {
            setLoading(true);
            // Create a new chat room only if the user is available to receive messages
            if (!creatorFCMToken || !brandFCMToken || !creatorId || !brandId || !name) {
                Alert.alert('The user may not be available at the moment',
                    'Please try again later',
                    [{
                        text: 'OK',
                        onPress: () => {},
                    }], { cancelable: false });
                return;
            }

            // Check if the chat room already exists
            const existingChatRoom = chatRooms?.find((chatRoom) => (
                chatRoom?.creatorId === creatorId && chatRoom?.brandId === brandId
            ));
            if (existingChatRoom) {
                Alert.alert('A conversation has already been started',
                    'You can check the chats tab and continue chatting',
                    [{
                        text: 'OK',
                        onPress: () => navigation.navigate(CHATS_STACK),
                    }], { cancelable: false });
                return;
            }
            const response = await firestore().collection(CHAT_ROOMS).add({
                name,
                creatorId,
                brandId,
                createdAt: firestore.FieldValue.serverTimestamp(),
                creatorFCMToken,
                brandFCMToken,
            });

            if (response) {
                setChatRoomCreated(true);
                Alert.alert('A conversation has been started',
                    'You can check the chats tab and continue chatting',
                    [{
                        text: 'OK',
                        onPress: () => navigation.navigate(CHATS_STACK),
                    }], { cancelable: false });
            }
        } catch (error) {
            console.log('[CREATE CHAT ROOM ERROR]', error);
            if (error.message) {
                Alert.alert('The user may not be available at the moment',
                    'Please try again later',
                    [{
                        text: 'OK',
                        onPress: () => {},
                    }], { cancelable: false });
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const unsubscribe = firestore()
            .collection(CHAT_ROOMS)
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapshot) => {
                const newChatRooms = querySnapshot?.docs?.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                if (isCreator) {
                    setChatRooms(newChatRooms?.filter((chatRoom) => (chatRoom?.creatorId === userId)));
                } else {
                    setChatRooms(newChatRooms?.filter((chatRoom) => (chatRoom?.brandId === userId)));
                }
            });
        return () => unsubscribe();
    }, [chatRoomCreated, isCreator, userId]);

    // Fetch chat rooms
    const fetchChatRooms = async () => {
        try {
            setFetchingChatRooms(true);
            const response = await firestore()
                .collection(CHAT_ROOMS)
                .orderBy('createdAt', 'desc')
                .get();
            const newChatRooms = response?.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            if (isCreator) {
                setChatRooms(newChatRooms?.filter((chatRoom) => (chatRoom?.creatorId === userId)));
            } else {
                setChatRooms(newChatRooms?.filter((chatRoom) => (chatRoom?.brandId === userId)));
            }
        } catch (error) {
            console.log('[FETCH CHAT ROOMS ERROR]', error);
        }
        setFetchingChatRooms(false);
    };

    return {
        chatRooms,
        loading,
        createChatRoom,
        chatRoomCreated,
        fetchChatRooms,
        fetchingChatRooms,
    };
};

export default useChatRooms;
