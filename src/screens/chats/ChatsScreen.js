import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import { LAVENDER, WHITE } from '../../theme/Colors';
import useChatsContext from '../../hooks/chats/useChatsContext';

const ChatsScreen = () => {
    const { messages: previousMessages, setMessages, chatUser } = useChatsContext();

    const onSend = (messages = []) => {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
    };

    return (
        <View
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <GiftedChat
                messages={previousMessages}
                onSend={(messages) => onSend(messages)}
                user={chatUser}
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
