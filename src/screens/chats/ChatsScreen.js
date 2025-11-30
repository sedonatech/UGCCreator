import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    query,
    where,
    orderBy as fsOrderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { LAVENDER, WHITE } from '../../theme/Colors';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import { CHAT_ROOMS } from '../../hooks/chats/useChatRooms';
import { DEFAULT_AVATAR } from '../../consts/content/Portfolio';
import useNotifications from '../../hooks/notifications/useNotifications';
import { CHATS } from '../../navigation/ScreenNames';

const MESSAGES = 'messages';
const ChatsScreen = ({ route }) => {
    const { sendNotification } = useNotifications();

    const isFocused = useIsFocused();

    const { auth } = useAuthContext();

    const { profile } = auth;

    const isCreator = profile?.type === 'creator';

    const chatRoomId = route.params?.chatRoomId;
    const [isTyping, setIsTyping] = useState(false);

    const chatRoomName = route.params?.name;
    const receiverFcmToken = route.params?.receiverFcmToken;

    const [chatRoom, setChatRoom] = useState(null);

    const [messages, setMessages] = useState([]);

    const chatUser = useMemo(() => {
        if (profile) {
            return {
                _id: profile?.id,
                name: profile?.userName || profile?.name || 'Brand',
                avatar: profile?.image || profile?.avatar || DEFAULT_AVATAR,
                type: profile?.type,
            };
        }
        return null;
    }, [profile]);

    const db = getFirestore();
    const fetchChatRoom = async () => {
        try {
            const chatRoomRef = doc(collection(db, CHAT_ROOMS), chatRoomId);
            const response = await getDoc(chatRoomRef);
            if (response?.exists()) {
                setChatRoom({
                    id: response.id,
                    ...response.data(),
                });
            }
        } catch (error) {
            console.log('[FETCH CHAT ROOM ERROR]', error);
        }
    };

    useEffect(() => {
        if (!chatRoomId) return null;
        fetchChatRoom();

        const messagesRef = collection(db, CHAT_ROOMS, chatRoomId, MESSAGES);
        const q = query(messagesRef, fsOrderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, snapshot => {
            const newMessages = snapshot?.docs?.map(docSnap => ({
                ...docSnap?.data(),
                id: docSnap?.id,
            }));
            setMessages(newMessages);
        });
        return unsubscribe;
    }, [chatRoomId]);

    // Mark messages as read
    useEffect(() => {
        const messagesRef = collection(db, CHAT_ROOMS, chatRoomId, MESSAGES);
        const q = query(messagesRef, where('read', '==', false), where('user._id', '!=', auth?.profile?.id));
        const unsubscribe = onSnapshot(q, snapshot => {
            snapshot?.docs?.forEach(docSnap => {
                updateDoc(doc(collection(db, CHAT_ROOMS, chatRoomId, MESSAGES), docSnap.id), { read: true });
            });
        });
        return unsubscribe;
    }, [chatRoomId, isFocused, profile?.id]);

    const onSendMessage = async (newMessage, fcmToken) => {
        try {
            const formattedMessages = newMessage?.map(message => ({
                ...message,
                read: false,
                sender: message?.user?.name,
                createdAt: new Date().toISOString(),
            }));
            const messagesRef = collection(db, CHAT_ROOMS, chatRoomId, MESSAGES);
            await addDoc(messagesRef, formattedMessages[0]);

            const chatRoomRef = doc(collection(db, CHAT_ROOMS), chatRoomId);
            await updateDoc(chatRoomRef, {
                lastMessageText: formattedMessages[0]?.text,
                lastMessageTimestamp: serverTimestamp(),
                createdAt: serverTimestamp(),
            });

            // send notification
            await sendNotification(
                receiverFcmToken,
                `New message from ${chatRoomName || 'UGCCreatorapp'}`,
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

    return (
        <View style={styles.container}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <GiftedChat
                messages={messages}
                onSend={newMessages =>
                    onSendMessage(newMessages, isCreator ? chatRoom?.brandFCMToken : chatRoom?.creatorFCMToken)
                }
                user={chatUser}
                placeholder="Type your message here..."
                alwaysShowSend
                showUserAvatar
                isTyping={false}
                loadEarlier
                // onLoadEarlier={() => {}}
                isLoadingEarlier={false}
                infiniteScroll
                isKeyboardInternallyHandled
                focusOnInputWhenOpeningKeyboard
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        paddingTop: 120,
    },
});
export default ChatsScreen;
