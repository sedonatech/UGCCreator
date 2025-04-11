import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { format } from 'date-fns';
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

    const fetchChatRoom = async () => {
        try {
            const response = await firestore()
                .collection(CHAT_ROOMS)
                .doc(chatRoomId)
                .get();
            if (response?.exists) {
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
        // fetch chat room
        fetchChatRoom();

        // listen for chatroom messages
        const unsubscribe = firestore()
            .collection(CHAT_ROOMS)
            .doc(chatRoomId)
            .collection(MESSAGES)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                const newMessages = snapshot?.docs?.map((doc) => ({
                    ...doc?.data(),
                    id: doc?.id,
                }));
                setMessages(newMessages);
            });

        return unsubscribe;
    }, [chatRoomId]);

    // Mark messages as read
    useEffect(() => {
        const unsubscribe = firestore()
            .collection(CHAT_ROOMS)
            .doc(chatRoomId)
            .collection(MESSAGES)
            .where('read', '==', false)
            .where('user._id', '!=', auth?.profile?.id)
            .onSnapshot((snapshot) => {
                snapshot?.docs?.forEach((doc) => {
                    doc.ref.update({ read: true });
                });
            });

        return unsubscribe;
    }, [chatRoomId, isFocused, profile?.id]);

    const onSendMessage = async (newMessage, fcmToken) => {
        try {
            const formattedMessages = newMessage?.map((message) => ({
                ...message,
                read: false,
                sender: message?.user?.name,
                createdAt: new Date().toISOString(),
            }));
            await firestore()
                .collection(CHAT_ROOMS)
                .doc(chatRoomId)
                .collection(MESSAGES)
                .add(formattedMessages[0]);

            await firestore().collection(CHAT_ROOMS).doc(chatRoomId).update({
                lastMessageText: formattedMessages[0]?.text,
                lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
                createdAt: firestore.FieldValue.serverTimestamp(),
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
        <View
            style={styles.container}
        >
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <GiftedChat
                messages={messages}
                onSend={(newMessages) => onSendMessage(newMessages,
                    isCreator
                        ? chatRoom?.brandFCMToken
                        : chatRoom?.creatorFCMToken)}
                user={chatUser}
                placeholder="Type your message here..."
                alwaysShowSend
                showUserAvatar
                isTyping
                // loadEarlier
                // onLoadEarlier={() => {}}
                isLoadingEarlier={false}
                infiniteScroll
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
