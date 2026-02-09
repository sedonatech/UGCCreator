import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import { useIsFocused } from '@react-navigation/native';
import { LAVENDER, WHITE } from '../../theme/Colors';
import useChatsContext from '../../hooks/chats/useChatsContext';
import useChatMessages from '../../hooks/chats/useChatMessages';
import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import useTranslation from '../../hooks/useTranslation';

const SupportChatScreen = () => {
    const { chatUser } = useChatsContext();

    const { t } = useTranslation();

    const isFocused = useIsFocused();

    const { onSendSupportMessage, getSupportMessages, supportMessages } = useChatMessages();

    useEffect(() => {
        if (isFocused) {
            getSupportMessages();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <GiftedChat
                messages={supportMessages}
                onSend={newMessages => onSendSupportMessage(newMessages)}
                user={chatUser}
                placeholder={t('chats.messagePlaceholder')}
                alwaysShowSend
                showUserAvatar
                isTyping
                loadEarlier
                onLoadEarlier={() => getSupportMessages()}
                isLoadingEarlier={false}
                infiniteScroll
                renderUsernameOnMessage
                scrollToBottom
                sent
                received
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
});
export default SupportChatScreen;
