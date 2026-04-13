import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { GRAY_400, GRAY_800, LAVENDER, TRANSPARENT, WHITE } from '../../theme/Colors';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import { CHAT_ROOMS } from '../../hooks/chats/useChatRooms';
import { DEFAULT_AVATAR } from '../../consts/content/Portfolio';
import useNotifications from '../../hooks/notifications/useNotifications';
import { CHATS } from '../../navigation/ScreenNames';
import useTranslation from '../../hooks/useTranslation';

const MESSAGES = 'messages';

const AutoGrowComposer = ({ composerHeight, text, onTextChanged, onInputSizeChanged, textInputProps }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const placeholder = textInputProps?.placeholder ?? 'Type a message...';

    return (
        <TextInput
            accessible
            accessibilityLabel={placeholder}
            placeholder={placeholder}
            placeholderTextColor={isDark ? GRAY_800 : GRAY_400}
            multiline
            scrollEnabled={false}
            value={text}
            onChangeText={onTextChanged}
            onContentSizeChange={e => {
                onInputSizeChanged?.(e.nativeEvent.contentSize);
            }}
            enablesReturnKeyAutomatically
            underlineColorAndroid={TRANSPARENT}
            keyboardAppearance={isDark ? 'dark' : 'default'}
            {...textInputProps}
            style={[
                styles.composerInput,
                { minHeight: composerHeight },
                isDark && styles.composerInputDark,
                textInputProps?.style,
            ]}
        />
    );
};

AutoGrowComposer.propTypes = {
    composerHeight: PropTypes.number,
    text: PropTypes.string,
    onTextChanged: PropTypes.func,
    onInputSizeChanged: PropTypes.func,
    textInputProps: PropTypes.object,
};

const ChatsScreen = ({ route }) => {
    const { sendNotification } = useNotifications();
    const insets = useSafeAreaInsets();

    const { t } = useTranslation();

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
            console.error('[FETCH CHAT ROOM ERROR]', error);
        }
    };

    useEffect(() => {
        if (!chatRoomId) return undefined;
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
        if (!chatRoomId || !profile?.id) return undefined;
        const messagesRef = collection(db, CHAT_ROOMS, chatRoomId, MESSAGES);
        const q = query(messagesRef, where('read', '==', false), where('user._id', '!=', profile.id));
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
                `${t('chats.notificationTitle')} ${chatRoomName || 'UGCCreatorapp'}`,
                formattedMessages[0]?.text,
                {
                    type: 'chats',
                    screen: CHATS,
                    chatRoomId: chatRoomId || '',
                    chatRoomName: chatRoomName || '',
                    senderFcmToken: auth?.profile?.fcmToken || '',
                },
            );
        } catch (error) {
            console.error('[SEND MESSAGE ERROR]', error);
        }
    };

    const customRenderComposer = useCallback(props => <AutoGrowComposer {...props} />, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top + 44 }]}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <GiftedChat
                    messages={messages}
                    onSend={newMessages =>
                        onSendMessage(newMessages, isCreator ? chatRoom?.brandFCMToken : chatRoom?.creatorFCMToken)
                    }
                    user={chatUser}
                    placeholder={t('chats.messagePlaceholder')}
                    alwaysShowSend
                    showUserAvatar
                    isTyping={false}
                    loadEarlier
                    isLoadingEarlier={false}
                    infiniteScroll
                    isKeyboardInternallyHandled={false}
                    renderComposer={customRenderComposer}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

ChatsScreen.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            chatRoomId: PropTypes.string,
            name: PropTypes.string,
            receiverFcmToken: PropTypes.string,
        }),
    }).isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    flex: {
        flex: 1,
    },
    composerInput: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
        lineHeight: 22,
        ...Platform.select({
            ios: { marginTop: 6, marginBottom: 5 },
            android: { marginTop: 0, marginBottom: 3 },
        }),
        maxHeight: 200,
    },
    composerInputDark: {
        color: WHITE,
    },
});
export default ChatsScreen;
