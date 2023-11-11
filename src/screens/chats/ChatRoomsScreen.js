import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import { WHITE } from '../../theme/Colors';
import {
    HEADER_MARGIN, SPACE_MEDIUM, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../theme/Layout';
import TemplateText from '../../components/TemplateText';
import { CHATS } from '../../navigation/ScreenNames';
import useChatsContext from '../../hooks/chats/useChatsContext';
import { wp } from '../../Utils/getResponsiveSize';
import useGetCreators from '../../hooks/brands/useGetCreators';
import useGetBrands from '../../hooks/creators/useGetBrands';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../consts/content/Portfolio';

const ChatRoomsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { creators } = useGetCreators();

    const { brands } = useGetBrands();

    const isCreator = auth?.profile?.type === 'creator';

    const {
        chatRooms,
        fetchChatRooms,
        fetchingChatRooms,
    } = useChatsContext();

    const getCreatorNameAndImage = (selectedId) => {
        if (isCreator && !creators?.length) return null;

        const creator = creators?.find(({ id }) => id === selectedId);
        return {
            name: creator?.userName,
            image: creator?.image,
        };
    };

    const getBrandNameAndImage = (selectedId) => {
        if (!brands?.length && !isCreator) return null;
        const brand = brands?.find(({ id }) => id === selectedId);
        return {
            name: brand?.userName,
            image: brand?.image,
        };
    };

    const ChatRoomCard = ({
        name,
        imageUrl,
        onPress,
    }) => (
        <TemplateBox
            width={wp(WRAPPED_SCREEN_WIDTH) - wp(WRAPPER_MARGIN * 2)}
            borderRadius={wp(20)}
            pAll={wp(16)}
            selfCenter
            mt={wp(SPACE_MEDIUM)}
            backgroundColor={WHITE}
            onPress={onPress}
            row
            alignItems="center"
        >
            <FastImage
                source={{ uri: imageUrl || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                style={styles.image}
            />

            <TemplateText bold size={wp(16)}>
                {name}
            </TemplateText>
        </TemplateBox>
    );

    ChatRoomCard.propTypes = {
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
    };

    return (
        <FlatList
            data={chatRooms}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item?.id}
            ListHeaderComponent={() => (
                <TemplateBox
                    mt={HEADER_MARGIN}
                    alignItems="center"
                    justifyContent="center"
                    mh={WRAPPER_MARGIN}
                >

                    <TemplateText
                        size={wp(18)}
                        startCase
                        bold
                        center
                    >
                        {`Continue your conversations with your ${isCreator ? 'brands' : 'creators'}`}
                    </TemplateText>
                    <TemplateBox height={WRAPPER_MARGIN} />
                </TemplateBox>
            )}
            renderItem={({ item }) => (
                <ChatRoomCard
                    name={isCreator
                        ? getBrandNameAndImage(item?.brandId)?.name
                        : getCreatorNameAndImage(item?.creatorId)?.name}
                    imageUrl={isCreator
                        ? getBrandNameAndImage(item?.brandId)?.image
                        : getCreatorNameAndImage(item?.creatorId)?.image}
                    onPress={() => {
                        navigation.navigate(CHATS, {
                            chatRoomId: item?.id,
                        });
                    }}
                />
            )}
            ListEmptyComponent={() => (
                <TemplateBox
                    mt={HEADER_MARGIN}
                    alignItems="center"
                    justifyContent="center"
                    mh={WRAPPER_MARGIN}
                >
                    <TemplateText
                        size={wp(16)}
                        center
                    >
                        There are no conversations yet
                    </TemplateText>
                    <TemplateBox height={WRAPPER_MARGIN} />
                </TemplateBox>
            )}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={fetchingChatRooms} onRefresh={fetchChatRooms} />
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    image: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(10),
        marginRight: wp(20),
    },
});

export default ChatRoomsScreen;
