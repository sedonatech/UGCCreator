import {
    FlatList,
    StyleSheet,
    RefreshControl,
    KeyboardAvoidingView,
    StatusBar,
    View,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import React, {
    useEffect, useMemo, useState, useRef, useLayoutEffect,
} from 'react';
import { orderBy } from 'lodash';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Fuse from 'fuse.js';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import {
    ERROR_RED, WHITE, BLACK, IOS_BLUE, LIGHT_GREEN,
    LAVENDER,
} from '../../theme/Colors';
import {
    HEADER_MARGIN, SPACE_MEDIUM, SPACE_SMALL, WRAPPER_MARGIN,
} from '../../theme/Layout';
import TemplateText from '../../components/TemplateText';
import {
    CHATS, CREATORS_PROFILES_STACK, START_SUPPOR_CHAT,
} from '../../navigation/ScreenNames';
import useChatsContext from '../../hooks/chats/useChatsContext';
import { hp, wp } from '../../Utils/getResponsiveSize';
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
import { CHAT_ROOMS } from '../../hooks/chats/useChatRooms';
import calculateLastLoginTime from '../../Utils/calculateLastLoginTime';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';

// info@ugccreatorapp.com brand details for support
const brandId = 'ng64onQ318Q8LghDizaB2sARx7r2'; // support brand id
const brandFCMToken = 'feIcGv7HvUWViQzFVuA_E9:APA91bEsjLxPCW0r4OkmCVRhjFJeQqzB1nlqKxiNcijXFhLfLCGRo8ptOEi-hpCt5WQuFy-IwDI1-dEZ0FazouXUPSxzg-kKsYHvY2pQ5JkXSDs31rLcMZsS45hKyKWoHcdy1aXOYJyp';

const ChatRoomsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { features } = useFeatureFlags();

    const showSupportChat = features?.showSupportChat;

    const swipeRef = useRef(null);

    const isCreator = auth?.profile?.type === 'creator';

    const userId = auth?.profile?.id;

    const userFCMToken = auth?.profile?.fcmToken;

    const [chatRooms, setChatRooms] = useState([]);

    const [limit, setLimit] = useState(10);

    const { createChatRoom } = useChatsContext();

    const [supportFcmToken, setSupportFcmToken] = useState({});

    const creatorRef = firestore().collection(CHAT_ROOMS)
        .limit(limit)
        .where('creatorId', '==', userId)
        .orderBy('createdAt', 'desc');

    const brandRef = firestore().collection(CHAT_ROOMS)
        .limit(limit)
        .where('brandId', '==', userId)
        .orderBy('createdAt', 'desc');

    useEffect(() => {
        fetchSupport();
    }, []);

    const fetchSupport = async () => {
        try {
            const fetchedUsers = await firestore().collection('users')
                .where('id', '==', brandId)
                .get()
                .then((querySnapshot) => querySnapshot?.docs
                    ?.map((doc) => ({
                        id: doc?.id,
                        ...doc?.data(),
                    })));

            setSupportFcmToken(fetchedUsers?.[0]?.fcmToken);
        } catch (e) {
            console.error('Error fetching brands:', e);
        }
    };

    // listen for chat rooms
    useEffect(() => {
        const unsubscribeCreator = creatorRef.onSnapshot(
            (querySnapshot) => {
                const creatorRooms = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setChatRooms((prevRooms) => {
                    const mergedRooms = [...prevRooms, ...creatorRooms];
                    return mergedRooms.filter(
                        (room, index, self) => index === self.findIndex((r) => r.id === room.id),
                    );
                });
            },
            (error) => {
                console.error('Error fetching creator chat rooms:', error);
            },
        );

        const unsubscribeBrand = brandRef.onSnapshot(
            (querySnapshot) => {
                const brandRooms = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setChatRooms((prevRooms) => {
                    const mergedRooms = [...prevRooms, ...brandRooms];
                    return mergedRooms.filter(
                        (room, index, self) => index === self.findIndex((r) => r.id === room.id),
                    );
                });
            },
            (error) => {
                console.error('Error fetching brand chat rooms:', error);
            },
        );

        return () => {
            unsubscribeCreator();
            unsubscribeBrand();
        };
    }, [isCreator, userId, limit]);

    const {
        // chatRooms,
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

    const searchedChatRooms = useMemo(() => {
        if (search?.length > 0) return searchResults;
        return chatRooms.sort((a, b) => {
            const aTime = a?.createdAt?.seconds ?? a.lastMessageTimestamp?.seconds ?? 0;
            const bTime = b?.createdAt?.seconds ?? b.lastMessageTimestamp?.seconds ?? 0;
            return bTime - aTime;
        });
    }, [search, searchResults, chatRooms]);

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
                        setChatRooms(chatRooms?.filter((item) => item?.id !== chatRoomId));
                        fetchChatRooms();
                    },
                    style: 'destructive',
                },
            ],
        );
    };

    useLayoutEffect(() => {
        if (showSupportChat) {
            navigation.setOptions({
                headerRight: () => (
                    <HeaderIconButton
                        title="Contact US"
                        onPress={handleOnPressSupportChat}
                        backDropColor={LIGHT_GREEN}
                        mr={WRAPPER_MARGIN}
                    />
                ),
            });
        }
    }, [navigation, showSupportChat]);

    const chatRoomName = 'SUPPORT CHAT';
    const [supportPress, setSupportPress] = useState(false);

    const handleSupportPress = async () => {
        try {
            await createChatRoom(
                chatRoomName,
                userId,
                brandId,
                userFCMToken,
                brandFCMToken,
            );
            setSupportPress(true);
        } catch (e) {
            console.log('-> e', e);
        }
    };

    const [showOptions, setShowOptions] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    name="add"
                    onPress={() => setShowOptions(!showOptions)}
                    backDropColor={WHITE}
                    mr={WRAPPER_MARGIN}
                />
            ),
            gestureEnabled: false,
        });
    }, [navigation, showOptions]);

    const options = [
        {
            title: 'Search Creators',
            onPress: () => {
                setShowOptions(false);
                navigation.navigate(CREATORS_PROFILES_STACK);
            },
        },
        {
            title: 'Support (Features / Bugs)',
            onPress: () => {
                setShowOptions(false);
                handleSupportPress();
            },
        },
    ];

    const supportChat = useMemo(() => searchedChatRooms?.find((chat) => chat?.brandId === brandId), [searchedChatRooms]);
    useEffect(() => {
        if (supportChat && supportPress) {
            navigation.navigate(CHATS, {
                chatRoomId: supportChat?.id,
                name: 'Support Chat',
                receiverFcmToken: supportFcmToken,
            });
            setSupportPress(false);
        }
    }, [supportChat, supportPress]);

    return (
        <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : 'height'}
            style={styles.mainContainer}
        >
            <StatusBar barStyle="dark-content" />
            <TouchableWithoutFeedback onPress={() => setShowOptions(false)} style={{ backgroundColor: 'red', flex: 1 }}>
                <View style={{ flex: 1 }}>
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
                                            size={wp(13)}
                                            center
                                            style={styles.swipeToDeleteText}
                                        >
                                            Swipe left to delete chat
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
                                        id={item?.id}
                                        userId={auth?.profile?.id}
                                        item={item}
                                        navigation={navigation}
                                        isSupport={brandId === item?.brandId}
                                        isCreator={isCreator}
                                        lastMessageText={item?.lastMessageText}
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
                                {(fetchingChatRooms)
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
                        onEndReached={() => { setLimit((prevLimit) => prevLimit + 10); }}
                    />

                    {showOptions
            && (
                <View
                    style={{
                        position: 'absolute',
                        right: WRAPPER_MARGIN,
                        top: HEADER_MARGIN * 0.85,
                        zIndex: 99,
                    }}
                >
                    {
                        options?.map(({ title, onPress }, index) => (
                            <TemplateBox
                                key={index}
                                zIndex={99}
                                backgroundColor={LAVENDER}
                                mb={hp(8)}
                                borderRadius={hp(8)}
                                fadeIn
                                slideInTime={100 + index * 100}
                                slideIn
                                slideInX={20}
                                debug
                            >
                                <TemplateBox
                                    onPress={onPress}
                                    ph={12}
                                    pv={12}
                                >
                                    <TemplateText size={hp(14)} semiBold>
                                        {title}
                                    </TemplateText>
                                </TemplateBox>
                            </TemplateBox>
                        ))
                    }
                </View>
            )}
                </View>
            </TouchableWithoutFeedback>
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
