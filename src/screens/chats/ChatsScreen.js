import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore';
import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import { LAVENDER, WHITE } from '../../theme/Colors';
import useChatsContext from '../../hooks/chats/useChatsContext';
import TemplateText from '../../components/TemplateText';
import { HEADER_MARGIN } from '../../theme/Layout';
import useChatMessages, { MESSAGES } from '../../hooks/chats/useChatMessages';
import { CHAT_ROOMS } from '../../hooks/chats/useChatRooms';

const ChatsScreen = ({ route }) => {
    const { createdChatRoom } = useChatsContext();

    const chatRoomId = route.params?.chatRoomId || createdChatRoom?.id;

    const {
        chatRooms, chatUser, messages, setMessages,
    } = useChatsContext();

    const selectedChatRoom = useMemo(() => {
        if (!chatRooms) return null;

        return chatRooms?.find((chat) => chat?.id === chatRoomId);
    }, [chatRooms, chatRoomId]);

    const { onSendMessage } = useChatMessages();

    useEffect(() => {
        const unsubscribe = firestore()
            .collection(CHAT_ROOMS)
            .doc(selectedChatRoom?.id)
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
    }, [selectedChatRoom?.id]);

    return (
        <View
            style={styles.container}
        >
            <TemplateBox
                mt={HEADER_MARGIN / 1.2}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText bold size={16}>{selectedChatRoom?.name}</TemplateText>
            </TemplateBox>
            <GiftedChat
                messages={messages}
                onSend={(newMessages) => onSendMessage(newMessages, selectedChatRoom)}
                user={chatUser}
                placeholder="Type your message here..."
                alwaysShowSend
                showUserAvatar
                isTyping
                loadEarlier
                onLoadEarlier={() => {}}
                isLoadingEarlier={false}
                infiniteScroll
            />

            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
});
export default ChatsScreen;
