import React, { useEffect, useMemo, useState } from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TemplateBox from '../../components/TemplateBox';
import { wp } from '../../Utils/getResponsiveSize';
import {  SPACE_SMALL } from '../../theme/Layout';
import { ERROR_RED, GREY, lightOrange, WHITE } from '../../theme/Colors';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../consts/content/Portfolio';
import TemplateText from '../../components/TemplateText';
// import useChatMessages, { MESSAGES } from '../../hooks/chats/useChatMessages';
import calculateLastLoginTime from '../../Utils/calculateLastLoginTime';
import { CHATS, CREATORS_PROFILES_STACK, PROFILE } from '../../navigation/ScreenNames';
import { CHAT_ROOMS } from '../../hooks/chats/useChatRooms';

const ChatRoomCard = ({
    id,
    item,
    userId,
    navigation,
    isSupport,
    isCreator,
}) => {
    // const { unreadMessagesCount } = useChatMessages(id);
    const usersRef = firestore().collection('users');

    const [users, setUsers] = useState([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    useEffect(() => {
        if (item) fetchUsers([item?.brandId, item?.creatorId]);
    }, [item]);

    const fetchUsers = async (ids) => {
        try {
            const fetchedUsers = await usersRef
                .where('id', 'in', ids)
                .get()
                .then((querySnapshot) => querySnapshot?.docs
                    ?.map((doc) => ({
                        id: doc?.id,
                        ...doc?.data(),
                        lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
                    })));

            setUsers(fetchedUsers);
        } catch (e) {
            console.error('Error fetching brands:', e);
        }
    };

    const receiver = useMemo(() => users?.find(
        (item) => userId !== item?.id,
    ), [userId, users]);

    useEffect(() => {
        if (!id) return () => {};
        const unsubscribe = firestore()
            .collection('chatRooms')
            .doc(id)
            .collection('messages')
            .where('read', '==', false)
            .onSnapshot((snapshot) => {
                const newMessages = snapshot?.docs?.map((doc) => ({
                    ...doc?.data(),
                    id: doc?.id,
                }));
                setUnreadMessagesCount(newMessages?.filter(
                    (message) => message?.user?._id !== userId)?.length);
            });

        return unsubscribe;
    }, [id]);

    return (
        <>
            <TemplateBox
                width={wp(354)}
                borderRadius={wp(20)}
                pAll={wp(16)}
                selfCenter
                mt={wp(SPACE_SMALL)}
                backgroundColor={WHITE}
                row
                alignItems="center"
                lightShadow
            >
                <TemplateBox
                    width={wp(354)}
                    absolute
                    top={0}
                    left={0}
                    zIndex={99}
                    onPress={() => {
                        navigation.navigate(CHATS, {
                            chatRoomId: id,
                            name: receiver?.name,
                            receiverFcmToken: receiver?.fcmToken,
                        });
                    }}
                />
                {isSupport && 
                    <View style={{alignSelf: 'flex-start', position: 'absolute', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: lightOrange, right: 20}} >
                        <TemplateText size={12} medium color={WHITE}>
                            Support
                        </TemplateText>
                    </View>
                }

                <TemplateBox style={styles.image} zIndex={9999} 
                    onPress={()=> {
                        if(!isCreator) return navigation.navigate(PROFILE, {
                            creatorId: receiver?.id,
                        })

                       return !isSupport && navigation.navigate(CREATORS_PROFILES_STACK, {
                                screen: PROFILE,
                                params:{ creatorId: receiver?.id }
                         })
                    }}
                    >
                    <FastImage
                        source={{ uri: receiver?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                        style={styles.image}
                    />
                </TemplateBox>

                <TemplateBox width='80%'>
                    <TemplateText bold size={wp(16)}>
                        {receiver?.userName || receiver?.name}
                    </TemplateText>
                    <TemplateBox height={wp(5)} />
                    {receiver?.lastLoginTime && !isSupport && (
                        <TemplateText size={wp(10)} color={GREY}>
                            {`Last active ${receiver?.lastLoginTime}`}
                        </TemplateText>
                    )}
                </TemplateBox>
                {!!unreadMessagesCount && (
                    <TemplateBox
                        height={wp(16)}
                        width={wp(16)}
                        borderRadius={wp(12)}
                        backgroundColor={ERROR_RED}
                        absolute
                        top={wp(10)}
                        left={wp(10)}
                        alignItems="center"
                        justifyContent="center"
                        zIndex={9999}
                    >
                        <TemplateText size={wp(12)} color={WHITE} bold>
                            {unreadMessagesCount}
                        </TemplateText>
                    </TemplateBox>
                )}
            </TemplateBox>
        </>
    );
};

ChatRoomCard.propTypes = {
    id: PropTypes.string.isRequired,
};
ChatRoomCard.defaultProps = {
};

const styles = StyleSheet.create({
    image: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(10),
        marginRight: wp(16),
    },
});

export default ChatRoomCard;
