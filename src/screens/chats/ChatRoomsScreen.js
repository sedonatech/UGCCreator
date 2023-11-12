import {
    FlatList, StyleSheet, RefreshControl, KeyboardAvoidingView, StatusBar, View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import Fuse from 'fuse.js';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import { BLACK, WHITE } from '../../theme/Colors';
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
import TemplateTextInput from '../../components/TemplateTextInput';
import { SHADOW } from '../../theme/Shadow';
import { isIOS } from '../../Utils/Platform';
import TemplateSafeAreaView from '../../components/TemplateSafeAreaView';

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

    const [search, setSearch] = useState('');

    const [searchResults, setSearchResults] = useState([]);

    const fuseOptions = {
        isCaseSensitive: false,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 1,
        threshold: 0.4,
        useExtendedSearch: true,
        keys: [
            'name',
        ],
    };

    useEffect(() => {
        if (!!search && chatRooms?.length) {
            const fuse = new Fuse(chatRooms, fuseOptions);
            const results = fuse.search(search).map(({ item }) => item);
            setSearchResults(results);
        }
    }, [search]);

    const searchedChatRooms = useMemo(() => (search?.length
        ? searchResults
        : chatRooms), [search, searchResults, chatRooms]);

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
            width={wp(WRAPPED_SCREEN_WIDTH) - wp(WRAPPER_MARGIN * 1.4)}
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
        <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : 'height'}
            style={styles.mainContainer}
        >
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={searchedChatRooms}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item?.id}
                ListHeaderComponent={(
                    <>
                        <TemplateBox
                            mt={HEADER_MARGIN}
                            alignItems="center"
                            justifyContent="center"
                            mh={WRAPPER_MARGIN}
                        >
                            <TemplateText
                                size={wp(16)}
                                startCase
                                bold
                                center
                            >
                                {`Continue your conversations with your ${isCreator ? 'brands' : 'creators'}`}
                            </TemplateText>
                            <TemplateBox height={WRAPPER_MARGIN} />
                            <TemplateTextInput
                                placeholder="Search"
                                style={[styles.input, SHADOW('default', WHITE)]}
                                value={search}
                                onChangeText={(text) => setSearch(text)}
                                autoCapitalize="none"
                            />
                            <TemplateBox height={WRAPPER_MARGIN} />
                        </TemplateBox>
                    </>
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
                ListFooterComponent={(
                    <View style={styles.listFooter}>
                        <TemplateSafeAreaView ios />
                    </View>
                )}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={fetchingChatRooms} onRefresh={fetchChatRooms} />
                }
                initialNumToRender={5}
                onEndReachedThreshold={0.5}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
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
    input: {
        width: '100%',
        height: wp(50),
        borderRadius: wp(10),
        paddingHorizontal: wp(12),
        fontSize: wp(16),
        color: BLACK,
    },
    listFooter: {
        paddingBottom: wp(SPACE_MEDIUM),
    },
});

export default ChatRoomsScreen;
