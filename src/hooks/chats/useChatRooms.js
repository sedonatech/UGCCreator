import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

export const CHAT_ROOMS = 'chatRooms';
const useChatRooms = () => {
    const [chatRooms, setChatRooms] = useState([]);

    const [loading, setLoading] = useState(false);

    const [chatRoomCreated, setChatRoomCreated] = useState(false);
    const createChatRoom = async (name, creatorId, brandId, creatorFCMToken, brandFCMToken) => {
        try {
            setLoading(true);
            // Create a new chat room only if the user is available to receive messages
            if (!creatorFCMToken || !brandFCMToken) {
                Alert.alert('The user may not be available at the moment',
                    'Please try again later',
                    [{
                        text: 'OK',
                        onPress: () => {},
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

            console.log('[CREATE CHAT ROOM RESPONSE]', response);
            if (response) {
                setChatRoomCreated(true);
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

    const chatRoomFiters = '';
    const chatRoomRef = firestore()
        .collection(CHAT_ROOMS)
        .orderBy('createdAt', 'desc')
        .where('creatorId', '==', 'creatorId');
    useEffect(() => {
        const unsubscribe = firestore()
            .collection(CHAT_ROOMS)
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapshot) => {
                const newChatRooms = querySnapshot?.docs?.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setChatRooms(newChatRooms);
            });
        return () => unsubscribe();
    }, [chatRoomCreated]);

    return {
        chatRooms,
        loading,
        createChatRoom,
        chatRoomCreated,
    };
};

export default useChatRooms;
