import { FlatList, SafeAreaView, StyleSheet, } from 'react-native';
import React, { useMemo } from 'react';

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
import LoadingOverlay from '../../components/LoadingOverlay';

const ChatRoomsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { creators: creatorsData } = useGetCreators();

    const creators = useMemo(() => {
        if (!creatorsData?.length) return [];

        return creatorsData?.filter((creator) => creator?.fcmToken);
    }, [creatorsData]);

    const isCreator = auth?.profile?.type === 'creator';

    const isBrand = auth?.profile?.type !== 'creator';

    const {
        createChatRoom,
        chatRooms,
        chatRoomCreated,
        createdChatRoom,
        setCreatedChatRoom,
        loading: chatRoomsLoading,
    } = useChatsContext();

    const chatRoomData = useMemo(() => {
        if (!chatRooms?.length) return [];

        return chatRooms?.map(({
            id, name, creatorId, brandId,
        }) => ({
            id, name, creatorId, brandId,
        }));
    }, [chatRooms]);

    const { brands: brandsData } = useGetBrands();

    const brands = useMemo(() => {
        if (!brandsData?.length) return [];

        return brandsData?.filter((brand) => brand?.fcmToken);
    }, [brandsData]);

    return (
        <>
            <SafeAreaView
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
                && (
                    <FlatList
                        data={uniqBy(brands, 'id')}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <ProfileStatusCard
                                key={item?.id}
                                title={item?.name}
                                description={`Start a conversation with ${item?.name}`}
                                showProgress={false}
                                style={styles.statusCard}
                                slideInDelay={200 + (index * 100)}
                                showIcon={false}
                                onPress={async () => {
                                    try {
                                        const chatRoomName = `BRAND: ${item?.name} - CREATOR:${auth?.profile?.userName} conversation`;
                                        const brandFCMToken = item?.fcmToken;
                                        const creatorFCMToken = auth?.profile?.fcmToken;

                                        if (chatRoomData?.length > 0
                                            && chatRoomData?.find(
                                                (room) => room?.creatorId === auth?.profile?.id
                                                    && room?.brandId === item?.id,
                                            )) {
                                            navigation.navigate(CHATS, {
                                                chatRoomId: chatRoomData?.find(
                                                    (room) => room?.creatorId === auth?.profile?.id
                                                        && room?.brandId === item?.id,
                                                )?.id,
                                            });
                                            return;
                                        }
                                        await createChatRoom(chatRoomName,
                                            auth?.profile?.id,
                                            item?.id,
                                            creatorFCMToken,
                                            brandFCMToken).then(() => {
                                            if (chatRoomCreated && !chatRoomsLoading) {
                                                setCreatedChatRoom(chatRoomData?.find(
                                                    (room) => room?.name === auth?.profile?.id
                                                        && room?.brandId === item?.id
                                                        && room?.name === chatRoomName,
                                                ));
                                                setTimeout(() => {
                                                    navigation.navigate(CHATS, {
                                                        chatRoomId: createdChatRoom?.id,
                                                    });
                                                }, 1000);
                                            }
                                        });
                                    } catch (e) {
                                        console.log('[ERROR IN CHAT ROOMS SCREEN]', e.message);
                                    }
                                }}
                            />
                        )}
                        keyExtractor={(item) => item?.id}
                    />
                )}
                { isBrand && creators?.length > 0
                && (
                    <FlatList
                        data={uniqBy(creators, 'id')}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <ProfileStatusCard
                                key={item?.id}
                                title={item?.userName}
                                description={`Start a conversation with ${item?.userName}`}
                                showProgress={false}
                                style={styles.statusCard}
                                slideInDelay={200 + (index * 100)}
                                showIcon={false}
                                onPress={async () => {
                                    try {
                                        const chatRoomName = `BRAND: ${auth?.profile?.name} - CREATOR:${item?.userName} conversation`;
                                        const brandFCMToken = auth?.profile?.fcmToken;
                                        const creatorFCMToken = item?.fcmToken;

                                        if (chatRoomData?.length > 0
                                            && chatRoomData?.find(
                                                (room) => room?.creatorId === item?.id
                                                    && room?.brandId === auth?.profile?.id,
                                            )) {
                                            navigation.navigate(CHATS, {
                                                chatRoomId: chatRoomData?.find(
                                                    (room) => room?.creatorId === item?.id
                                                        && room?.brandId === auth?.profile?.id,
                                                )?.id,
                                            });
                                            return;
                                        }
                                        await createChatRoom(chatRoomName,
                                            item?.id,
                                            auth?.profile?.id,
                                            creatorFCMToken,
                                            brandFCMToken).then(() => {
                                            if (chatRoomCreated && !chatRoomsLoading) {
                                                setCreatedChatRoom(chatRoomData?.find(
                                                    (room) => room?.creatorId === item?.id
                                                        && room?.brandId === auth?.profile?.id
                                                        && room?.name === chatRoomName,
                                                ));
                                                setTimeout(() => {
                                                    navigation.navigate(CHATS, {
                                                        chatRoomId: createdChatRoom?.id,
                                                    });
                                                }, 1000);
                                            }
                                        });
                                    } catch (e) {
                                        console.log('[ERROR IN CHAT ROOMS SCREEN]', e.message);
                                    }
                                }}
                            />
                        )}
                        keyExtractor={(item) => item?.id}
                    />
                )}
            </SafeAreaView>
            {chatRoomsLoading && (
                <LoadingOverlay message="Creating chat rooom...." />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,

    },
    statusCard: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default ChatRoomsScreen;
