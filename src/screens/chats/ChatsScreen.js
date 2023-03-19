import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import { LAVENDER, WHITE } from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import useChatsContext from '../../hooks/chats/useChatsContext';

const ChatsScreen = () => {
    const { clientReady, currentUser } = useChatsContext();
    console.log('-> currentUser', currentUser);
    console.log('-> clientReady', clientReady);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <TemplateText>Stream chats</TemplateText>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
});
export default ChatsScreen;
