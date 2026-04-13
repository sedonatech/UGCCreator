import React, { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import { BLACK, BRAND_BLUE, GREEN, GREY, GREY_30, LIGHT_PURPLE, WHITE } from '../../../../theme/Colors';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import { CHAT_ROOM, CHATS, PROFILE } from '../../../../navigation/ScreenNames';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import FastImage from 'react-native-fast-image';
import { wp } from '../../../../Utils/getResponsiveSize';
import useTranslation from '../../../../hooks/useTranslation';

const USERS_COLLECTION = 'users';

const CHAT_ROOMS_COLLECTION = 'chatRooms';

const ContactCreatorSection = ({ creatorID, creatorEmail, creatorFCMToken, projectTitle }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { auth } = useAuthContext();
    const brandId = auth?.profile?.id;
    const brandFCMToken = auth?.profile?.fcmToken;

    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (creatorID) fetchCreator();
    }, [creatorID]);

    const fetchCreator = async () => {
        try {
            const db = getFirestore();
            const creatorDoc = await getDoc(doc(db, USERS_COLLECTION, creatorID));
            if (creatorDoc.exists) {
                setCreator({ id: creatorDoc.id, ...creatorDoc.data() });
            }
        } catch (error) {
            console.log('[FETCH CREATOR ERROR]', error);
        }
    };

    const navigateToChat = (chatRoomId, chatName, receiverFcmToken) => {
        navigation.navigate(CHAT_ROOM, {
            screen: CHATS,
            params: {
                chatRoomId,
                name: chatName,
                receiverFcmToken,
            },
        });
    };

    const handleStartChat = async () => {
        if (!creatorID || !brandId) {
            Alert.alert(
                t('chats.alerts.userNotAvailable.title') || 'User Not Available',
                t('chats.alerts.userNotAvailable.message') || 'This user is not available for chat.',
            );
            return;
        }

        try {
            setLoading(true);
            const db = getFirestore();
            const chatRoomsRef = collection(db, CHAT_ROOMS_COLLECTION);
            const chatName = `${auth?.profile?.userName || auth?.profile?.name} & ${
                creator?.userName || creator?.name
            }`;

            // Check if chat room already exists
            const brandToCreatorQuery = query(
                chatRoomsRef,
                where('brandId', '==', brandId),
                where('creatorId', '==', creatorID),
            );
            const foundChat = await getDocs(brandToCreatorQuery);

            if (foundChat?.docs?.length) {
                // Room exists — navigate directly to it
                const existingRoom = foundChat.docs[0];
                navigateToChat(existingRoom.id, chatName, creatorFCMToken);
                return;
            }

            // No existing room — create one then navigate
            const newRoom = await addDoc(chatRoomsRef, {
                name: chatName,
                creatorId: creatorID,
                brandId,
                createdAt: serverTimestamp(),
                creatorFCMToken,
                brandFCMToken,
                lastMessageTimestamp: serverTimestamp(),
            });

            if (newRoom?.id) {
                navigateToChat(newRoom.id, chatName, creatorFCMToken);
            }
        } catch (error) {
            console.log('[START CHAT ERROR]', error);
            Alert.alert(
                t('chats.alerts.userNotAvailable.title') || 'Error',
                t('chats.alerts.userNotAvailable.message') || 'Could not start chat. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = () => {
        const email = creatorEmail || creator?.contact?.email || creator?.email;
        if (!email) {
            Alert.alert(
                t('brands.admin.contactCreator.noEmail.title') || 'No Email Available',
                t('brands.admin.contactCreator.noEmail.message') || 'This creator has not provided an email address.',
            );
            return;
        }
        const subject = encodeURIComponent(projectTitle ? `Re: ${projectTitle}` : 'Project Inquiry');
        Linking.openURL(`mailto:${email}?subject=${subject}`);
    };

    const creatorName = creator?.userName || creator?.name || 'Creator';
    const creatorImage = creator?.image;
    const creatorLocation = creator?.location?.city || creator?.location?.country;

    return (
        <TemplateBox ph={WRAPPER_MARGIN} mt={WRAPPER_MARGIN} mb={WRAPPER_MARGIN * 2}>
            {/* Creator Info */}
            <TemplateBox backgroundColor={GREY_30} borderRadius={12} pAll={16} row alignItems="center" mb={20}>
                {creatorImage ? (
                    <FastImage
                        source={{ uri: creatorImage }}
                        style={styles.avatar}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                ) : (
                    <TemplateBox
                        width={wp(60)}
                        height={wp(60)}
                        borderRadius={wp(30)}
                        backgroundColor={LIGHT_PURPLE}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <TemplateText bold size={22} color={BRAND_BLUE}>
                            {creatorName?.charAt(0)?.toUpperCase()}
                        </TemplateText>
                    </TemplateBox>
                )}
                <TemplateBox ml={14} flex>
                    <TemplateText bold size={16} color={BLACK}>
                        {creatorName}
                    </TemplateText>
                    {!!creatorLocation && (
                        <TemplateBox row alignItems="center" mt={4}>
                            <TemplateIcon name="location-outline" size={14} color={GREY} />
                            <TemplateText size={13} color={GREY} ml={2}>
                                {creatorLocation}
                            </TemplateText>
                        </TemplateBox>
                    )}
                </TemplateBox>
            </TemplateBox>

            {/* View Profile Button */}
            <TemplateBox
                backgroundColor={BLACK}
                borderRadius={12}
                height={52}
                row
                alignItems="center"
                justifyContent="center"
                mb={12}
                onPress={() => navigation.navigate(PROFILE, { creatorId: creatorID })}
            >
                <TemplateIcon name="person-outline" size={20} color={WHITE} />
                <TemplateText bold size={15} color={WHITE} ml={10}>
                    {t('brands.admin.contactCreator.viewProfile') || 'View Profile'}
                </TemplateText>
            </TemplateBox>

            {/* Chat Button */}
            <TemplateBox
                backgroundColor={BRAND_BLUE}
                borderRadius={12}
                height={52}
                row
                alignItems="center"
                justifyContent="center"
                mb={12}
                onPress={handleStartChat}
                opacity={loading ? 0.6 : 1}
            >
                <TemplateIcon name="chatbubble-ellipses-outline" size={20} color={WHITE} />
                <TemplateText bold size={15} color={WHITE} ml={10}>
                    {t('brands.admin.contactCreator.chat') || 'Message Creator'}
                </TemplateText>
            </TemplateBox>

            {/* Email Button */}
            <TemplateBox
                backgroundColor={GREEN}
                borderRadius={12}
                height={52}
                row
                alignItems="center"
                justifyContent="center"
                mb={12}
                onPress={handleSendEmail}
            >
                <TemplateIcon name="mail-outline" size={20} color={WHITE} />
                <TemplateText bold size={15} color={WHITE} ml={10}>
                    {t('brands.admin.contactCreator.email') || 'Send Email'}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
    );
};

ContactCreatorSection.propTypes = {
    creatorID: PropTypes.string,
    creatorEmail: PropTypes.string,
    creatorFCMToken: PropTypes.string,
    projectTitle: PropTypes.string,
};

ContactCreatorSection.defaultProps = {
    creatorID: '',
    creatorEmail: '',
    creatorFCMToken: '',
    projectTitle: '',
};

const styles = StyleSheet.create({
    avatar: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
    },
});

export default ContactCreatorSection;
