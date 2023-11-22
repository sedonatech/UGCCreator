import {
    FlatList,
    StyleSheet,
    RefreshControl,
    KeyboardAvoidingView,
    StatusBar,
    View,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, {
    useEffect, useMemo, useState, useRef, useLayoutEffect,
} from 'react';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import Fuse from 'fuse.js';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import {
    ERROR_RED, WHITE, BLACK, IOS_BLUE, LIGHT_GREEN,
} from '../../theme/Colors';
import {
    HEADER_MARGIN, SPACE_MEDIUM, SPACE_SMALL, WRAPPER_MARGIN,
} from '../../theme/Layout';
import TemplateText from '../../components/TemplateText';
import {
    CHATS, CREATORS_PROFILES_STACK, START_SUPPOR_CHAT,
} from '../../navigation/ScreenNames';
import useChatsContext from '../../hooks/chats/useChatsContext';
import { wp } from '../../Utils/getResponsiveSize';
import useGetCreators from '../../hooks/brands/useGetCreators';
import useGetBrands from '../../hooks/creators/useGetBrands';
import TemplateIcon from '../../components/TemplateIcon';
import TemplateTextInput from '../../components/TemplateTextInput';
import { SHADOW } from '../../theme/Shadow';
import { isIOS } from '../../Utils/Platform';
import TemplateSafeAreaView from '../../components/TemplateSafeAreaView';
import Button from '../../components/Button';
import HeaderIconButton from '../../components/header/HeaderButton';
import ChatRoomCard from './ChatRoomCard';

const ChatRoomsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { creators } = useGetCreators();

    const { brands } = useGetBrands();

    const swipeRef = useRef(null);

    const isCreator = auth?.profile?.type === 'creator';

    const {
        chatRooms,
        fetchChatRooms,
        fetchingChatRooms,
        deleteChatRoom,
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

    const getCreatorDetails = (selectedId) => {
        if (isCreator && !creators?.length) return null;

        const creator = creators?.find(({ id }) => id === selectedId);
        return {
            name: creator?.userName,
            image: creator?.image,
            lastLoginTime: creator?.lastLoginTime,
        };
    };

    const getBrandDetails = (selectedId) => {
        if (!brands?.length && !isCreator) return null;
        const brand = brands?.find(({ id }) => id === selectedId);

        return {
            name: brand?.userName,
            image: brand?.image,
            lastLoginTime: brand?.lastLoginTime,
        };
    };

    // Handle chat room deletion
    const handleDeleteChat = (chatRoomId) => {
        Alert.alert(
            'Delete Chat',
            'Are you sure you want to delete this chat?',
            [
                {
                    text: 'Cancel',
                    onPress: () => swipeRef?.current?.close(),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteChatRoom(chatRoomId);
                        swipeRef?.current?.close();
                        fetchChatRooms();
                    },
                    style: 'destructive',
                },
            ],
        );
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    title="Contact US"
                    onPress={() => navigation.navigate(START_SUPPOR_CHAT)}
                    backDropColor={LIGHT_GREEN}
                    mr={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

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
                            {!!searchedChatRooms?.length && (
                                <TemplateText
                                    size={wp(14)}
                                    center
                                    style={styles.swipeToDeleteText}
                                >
                                    swipe left to delete chat
                                </TemplateText>
                            )}
                            <TemplateBox height={WRAPPER_MARGIN} />
                            {!!searchedChatRooms?.length && (
                                <TemplateTextInput
                                    placeholder="Search"
                                    style={[styles.input, SHADOW('default', WHITE)]}
                                    value={search}
                                    onChangeText={(text) => setSearch(text)}
                                    autoCapitalize="none"
                                />
                            )}
                            <TemplateBox height={WRAPPER_MARGIN} />
                        </TemplateBox>
                    </>
                )}
                renderItem={({ item }) => (
                    <GestureHandlerRootView>
                        <Swipeable
                            ref={swipeRef}
                            friction={2}
                            containerStyle={styles.swipeContainer}
                            useNativeAnimations
                            renderRightActions={
                                () => (
                                    <TemplateBox
                                        center
                                        selfCenter
                                        mr={wp(WRAPPER_MARGIN)}
                                        mt={wp(SPACE_SMALL)}
                                        onPress={() => handleDeleteChat(item?.id)}
                                    >
                                        <TemplateIcon
                                            name="trash"
                                            size={wp(24)}
                                            color={ERROR_RED}
                                            style={styles.deleteIcon}
                                        />
                                        <TemplateText
                                            color={ERROR_RED}
                                            size={wp(9)}
                                            bold
                                        >
                                            Delete
                                        </TemplateText>
                                    </TemplateBox>
                                )
                            }
                        >
                            <ChatRoomCard
                                name={isCreator
                                    ? getBrandDetails(item?.brandId)?.name
                                    : getCreatorDetails(item?.creatorId)?.name}
                                imageUrl={isCreator
                                    ? getBrandDetails(item?.brandId)?.image
                                    : getCreatorDetails(item?.creatorId)?.image}
                                lastLoginTime={isCreator
                                    ? getBrandDetails(item?.brandId)?.lastLoginTime
                                    : getCreatorDetails(item?.creatorId)?.lastLoginTime}
                                onPress={() => {
                                    navigation.navigate(CHATS, {
                                        chatRoomId: item?.id,
                                    });
                                }}
                                id={item?.id}
                                userId={auth?.profile?.id}
                            />
                        </Swipeable>
                    </GestureHandlerRootView>
                )}
                ListEmptyComponent={() => (
                    <TemplateBox
                        mt={HEADER_MARGIN}
                        alignItems="center"
                        justifyContent="center"
                        mh={WRAPPER_MARGIN}
                    >
                        {fetchingChatRooms
                            ? <ActivityIndicator size="large" color={IOS_BLUE} />
                            : (
                                <TemplateBox alignItems="center">
                                    <TemplateText
                                        size={wp(16)}
                                        center
                                    >
                                        There are no conversations yet
                                    </TemplateText>
                                    <Button
                                        title="Start a conversation"
                                        onPress={() => navigation.navigate(CREATORS_PROFILES_STACK)}
                                        style={styles.button}
                                    />
                                </TemplateBox>
                            )}

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
    swipeContainer: {
        overflow: 'visible',
    },
    deleteIcon: {
        marginLeft: wp(4),
    },
    button: {
        marginTop: wp(20),
        height: wp(40),
        width: wp(240),
    },
    swipeToDeleteText: {
        marginTop: wp(8),
    },
});

export default ChatRoomsScreen;
