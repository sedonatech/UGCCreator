import { ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useMemo } from 'react';

import { uniqBy } from 'lodash';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import { WHITE } from '../../theme/Colors';
import useGetBrands from '../../hooks/creators/useGetBrands';
import ProfileStatusCard from '../../components/cards/ProfileStatusCard';
import { HEADER_MARGIN, WRAPPER_MARGIN } from '../../theme/Layout';
import TemplateText from '../../components/TemplateText';
import { CHATS } from '../../navigation/ScreenNames';
import useChatsContext from '../../hooks/chats/useChatsContext';
import useGetCreators from '../../hooks/brands/useGetCreators';

const ChatRoomsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { creators } = useGetCreators();

    const isCreator = auth?.profile?.type === 'creator';

    const isBrand = auth?.profile?.type !== 'creator';

    const {
        createChatRoom, chatRooms, chatRoomCreated, createdChatRoom, setCreatedChatRoom,
    } = useChatsContext();

    const chatRoomData = useMemo(() => {
        if (!chatRooms?.length) return [];

        return chatRooms?.map(({
            id, name, creatorId, brandId,
        }) => ({
            id, name, creatorId, brandId,
        }));
    }, [chatRooms]);

    const { brands } = useGetBrands();

    useEffect(() => {
        if (chatRoomCreated) {
            setTimeout(() => {
                navigation.navigate(CHATS, {
                    chatRoomId: createdChatRoom?.id,
                });
            }, 1500);
        }
    }, [chatRoomCreated]);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox
                mt={HEADER_MARGIN}
                alignItems="center"
                justifyContent="center"
                mh={WRAPPER_MARGIN}
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
                                const chatRoomName = `BRAND: ${brand?.name} - CREATOR:${auth?.profile?.userName} conversation`;
                                const brandFCMToken = brand?.fcmToken;
                                const creatorFCMToken = auth?.profile?.fcmToken;

                                if (chatRoomData?.length > 0
                                    && chatRoomData?.find(
                                        (room) => room?.creatorId === auth?.profile?.id
                                        && room?.brandId === brand?.id,
                                    )) {
                                    navigation.navigate(CHATS, {
                                        chatRoomId: chatRoomData?.find(
                                            (room) => room?.creatorId === auth?.profile?.id
                                            && room?.brandId === brand?.id,
                                        )?.id,
                                    });
                                    return;
                                }
                                await createChatRoom(chatRoomName,
                                    auth?.profile?.id,
                                    brand?.id,
                                    creatorFCMToken,
                                    brandFCMToken);

                                if (chatRoomCreated) {
                                    setCreatedChatRoom(chatRoomData?.find(
                                        (room) => room?.creatorId === auth?.profile?.id
                                        && room?.brandId === brand?.id,
                                    ));
                                }
                            } catch (e) {
                                console.log('[ERROR IN CHAT ROOMS SCREEN]', e.message);
                            }
                        }}
                    />
                ))}
            { isBrand && creators?.length > 0
                && uniqBy(creators, 'id')?.map((creator) => (
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
                                const chatRoomName = `BRAND: ${auth?.profile?.name} - CREATOR:${creator?.userName} conversation`;
                                const brandFCMToken = auth?.profile?.fcmToken;
                                const creatorFCMToken = creator?.fcmToken;

                                if (chatRoomData?.length > 0
                                    && chatRoomData?.find(
                                        (room) => room?.creatorId === creator?.id
                                        && room?.brandId === auth?.profile?.id,
                                    )) {
                                    navigation.navigate(CHATS, {
                                        chatRoomId: chatRoomData?.find(
                                            (room) => room?.creatorId === creator?.id
                                            && room?.brandId === auth?.profile?.id,
                                        )?.id,
                                    });
                                    return;
                                }

                                await createChatRoom(chatRoomName,
                                    creator?.id,
                                    auth?.profile?.id,
                                    creatorFCMToken,
                                    brandFCMToken);

                                setTimeout(() => {
                                    if (chatRoomCreated) {
                                        setCreatedChatRoom(chatRoomData?.find(
                                            (room) => room?.creatorId === creator?.id
                                                && room?.brandId === auth?.profile?.id,
                                        ));
                                    }
                                }, 1500);
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
        paddingHorizontal: WRAPPER_MARGIN,
    },
    statusCard: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default ChatRoomsScreen;
