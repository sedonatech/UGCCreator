import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

export const CHAT_ROOMS = 'chatRooms';
const useChatRooms = () => {
    const [chatRooms, setChatRooms] = useState([]);

    const [loading, setLoading] = useState(false);
    const createChatRoom = async (name) => {
        try {
            setLoading(true);
            await firestore().collection(CHAT_ROOMS).add({
                name,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            console.log('[CREATE CHAT ROOM ERROR]', error);
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
                setChatRooms(newChatRooms);
            });
        return () => unsubscribe();
    }, []);

    return {
        chatRooms,
        loading,
        createChatRoom,
    };
};

export default useChatRooms;
