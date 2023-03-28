import { ScrollView, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import Blob from '../../../assets/svgs/Blob';
import { LAVENDER, WHITE } from '../../theme/Colors';
import useGetBrands from '../../hooks/creators/useGetBrands';
import ProfileStatusCard from '../../components/cards/ProfileStatusCard';
import { HEADER_MARGIN, WRAPPER_MARGIN } from '../../theme/Layout';
import TemplateText from '../../components/TemplateText';
import { CHATS } from '../../navigation/ScreenNames';
import useChatsContext from '../../hooks/chats/useChatsContext';
import useGetCreators from '../../hooks/brands/useGetCreators';

const ChatRoomsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { profile } = auth;

    const { creators } = useGetCreators();

    const isCreator = profile?.type === 'creator';

    const { createChatRoom, chatRooms } = useChatsContext();

    const chatRoomNames = useMemo(() => {
        if (!chatRooms?.length) return [];

        return chatRooms?.map((chatRoom) => chatRoom?.name);
    }, [chatRooms]);

    const { brands } = useGetBrands();

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>

            <TemplateBox
                mt={HEADER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    startCase
                    bold
                    center
                >
                    {`Start a conversation with a ${isCreator ? 'brand' : 'creator'} you're interested in`}
                </TemplateText>
                <TemplateBox height={WRAPPER_MARGIN} />
            </TemplateBox>
            { isCreator && brands?.length > 0
                && brands?.map((brand) => (
                    <ProfileStatusCard
                        key={brand?.id}
                        title={brand?.name}
                        description={`Start a conversation with ${brand?.name}`}
                        showProgress={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                        showIcon={false}
                        onPress={async () => {
                            try {
                                const chatRoomName = `${brand?.name} - ${profile?.userName} conversation`;
                                if (chatRoomNames?.length > 0
                                    && chatRoomNames?.includes(chatRoomName)) {
                                    navigation.navigate(CHATS, {
                                        chatRoomName,
                                    });
                                    return;
                                }
                                await createChatRoom(chatRoomName);
                                navigation.navigate(CHATS, {
                                    chatRoomName: `${brand?.name} - ${profile?.userName} conversation`,
                                });
                            } catch (e) {
                                console.log('[ERROR IN CHAT ROOMS SCREEN]', e.message);
                            }
                        }}
                    />
                ))}
            { !isCreator && creators?.length > 0
                && creators?.map((creator) => (
                    <ProfileStatusCard
                        key={creator?.id}
                        title={creator?.userName}
                        description={`Start a conversation with ${creator?.userName}`}
                        showProgress={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                        showIcon={false}
                        onPress={async () => {
                            try {
                                const chatRoomName = `${profile?.userName} - ${creator?.userName} conversation`;
                                if (chatRoomNames?.length > 0
                                    && chatRoomNames?.includes(chatRoomName)) {
                                    navigation.navigate(CHATS, {
                                        chatRoomName,
                                    });
                                    return;
                                }
                                await createChatRoom(chatRoomName);
                                navigation.navigate(CHATS, {
                                    chatRoomName: `${creator?.userName} - ${profile?.userName} conversation`,
                                });
                            } catch (e) {
                                console.log('[ERROR IN CHAT ROOMS SCREEN]', e.message);
                            }
                        }}
                    />
                ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        alignItems: 'center',
        paddingHorizontal: WRAPPER_MARGIN,
    },
    statusCard: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default ChatRoomsScreen;
