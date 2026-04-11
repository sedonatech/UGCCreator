import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import { BLACK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import PortfolioHeader from './components/PortfolioHeader';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { DEFAULT_CREATOR_PAYPAL_LINK } from '../../../consts/content/Portfolio';
import Pdf from 'react-native-pdf';
import DocumentPicker, { types } from 'react-native-document-picker';
import TemplateBox from '../../../components/TemplateBox';
import Button from '../../../components/Button';
import CreatorDetailsHeader from './components/CreatorDetailsHeader';
import LoadingOverlay from '../../../components/LoadingOverlay';
import PortfolioCarousel from './components/PortfolioCarousel';
import TemplateText from '../../../components/TemplateText';
import { CHAT_ROOM, CHATS, MEDIA_KIT, WEBVIEW } from '../../../navigation/ScreenNames';
import useProfile from '../../../hooks/user/useProfile';
import ContactSection from './components/ContactSection';
import useTranslation from '../../../hooks/useTranslation';

const USERS_COLLECTION = 'users';

const PortfolioScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const creatorId = route?.params?.creatorId;
    const [selectedCreator, setSelectedCreator] = useState({});
    const { saveMediaKitPdf } = useProfile();

    useEffect(() => {
        if (creatorId) getProfile();
    }, [creatorId]);

    const getProfile = async () => {
        try {
            const db = getFirestore();
            const userRef = doc(collection(db, USERS_COLLECTION), creatorId);
            const documentSnapshot = await getDoc(userRef);
            if (documentSnapshot.exists()) {
                setSelectedCreator({
                    id: documentSnapshot.id,
                    ...documentSnapshot.data(),
                });
            } else {
                console.log('Document does not exist');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const { auth } = useAuthContext();

    const isBrand = auth?.profile?.type === 'brand';
    const creator = creatorId ? selectedCreator : auth?.profile;
    const profile = auth?.profile;
    const userName = creator?.userName;
    const image = creator?.image;
    const contact = creator?.contact || '';
    const socials = creator?.socialMedia || '';
    const paypalLink = creator?.paypalLink || DEFAULT_CREATOR_PAYPAL_LINK;
    const location = creator?.location?.country || creator?.location?.city;
    const email = creator?.email;
    const creatorFCMToken = creator?.fcmToken;
    const creatorName = creator?.userName || creator?.name;
    const brandId = auth?.profile?.id;
    const brandFCMToken = auth?.profile?.fcmToken;
    const brandName = auth?.profile?.userName || auth?.profile?.name;
    const loading = Object.keys(selectedCreator)?.length === 0 && isBrand;
    const [chatLoading, setChatLoading] = useState(false);

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

    const handleContactCreator = async () => {
        if (!creatorFCMToken || !brandFCMToken || !creatorId || !brandId) {
            Alert.alert(
                t('chats.alerts.userNotAvailable.title') || 'User Not Available',
                t('chats.alerts.userNotAvailable.message') || 'This user is not available for chat.',
            );
            return;
        }

        try {
            setChatLoading(true);
            const db = getFirestore();
            const chatRoomsRef = collection(db, 'chatRooms');
            const chatName = `${brandName} & ${creatorName}`;

            const existingQuery = query(
                chatRoomsRef,
                where('brandId', '==', brandId),
                where('creatorId', '==', creatorId),
            );
            const foundChat = await getDocs(existingQuery);

            if (foundChat?.docs?.length) {
                const existingRoom = foundChat.docs[0];
                navigateToChat(existingRoom.id, chatName, creatorFCMToken);
                return;
            }

            const newRoom = await addDoc(chatRoomsRef, {
                name: chatName,
                creatorId,
                brandId,
                createdAt: serverTimestamp(),
                creatorFCMToken,
                brandFCMToken,
                lastMessageTimestamp: serverTimestamp(),
            });

            if (newRoom?.id) {
                navigateToChat(newRoom.id, chatName, creatorFCMToken);
            }
        } catch (e) {
            console.log('[CONTACT CREATOR ERROR]', e);
            Alert.alert('Error', 'Could not start chat. Please try again.');
        } finally {
            setChatLoading(false);
        }
    };

    const pickPdf = async () => {
        const res = await DocumentPicker.pickSingle({
            type: [types.pdf],
            copyTo: 'cachesDirectory',
        });

        // On iOS, res.uri may point at a provider location; use the copied file.
        if (!res.fileCopyUri) throw new Error('No local fileCopyUri; picker did not copy the PDF to app storage');

        return {
            path: res.fileCopyUri,
            filename: res.name || 'media-kit.pdf',
        };
    };
    const onPickAndUploadMediaKit = async () => {
        try {
            const picked = await pickPdf();
            const result = await saveMediaKitPdf({
                uuid: auth?.profile?.id,
                response: picked,
            });
            if (result?.url) {
                auth.update('mediaKit', { url: result.url });
            }
        } catch (e) {
            console.log('pick/upload failed:', e);
        }
    };
    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {creatorId ? (
                    <CreatorDetailsHeader userName={userName} location={location} image={image} />
                ) : (
                    <PortfolioHeader userName={userName} location={location} creatorId={creatorId} image={image} />
                )}
                {!creatorId && (
                    <TemplateBox
                        selfCenter
                        mv={WRAPPER_MARGIN}
                        mh={WRAPPER_MARGIN}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <TemplateText size={18} bold mb={16}>
                            {t('profile.portfolio.mediaKitTitle')}
                        </TemplateText>
                        <TemplateText size={14} mb={14} center>
                            {t('profile.portfolio.mediaKitDescription')}
                        </TemplateText>
                        {!!profile?.mediaKit?.url && (
                            <TemplateBox
                                onPress={() => navigation.navigate(MEDIA_KIT, { uri: profile?.mediaKit?.url })}
                            >
                                <Pdf
                                    source={{ uri: profile?.mediaKit?.url, cache: false }}
                                    page={1}
                                    singlePage={true}
                                    fitPolicy={0}
                                    spacing={0}
                                    trustAllCerts={false}
                                    scrollEnabled={true}
                                    style={styles.pdfPreview}
                                    onError={e => console.log('[MEDIA-KIT]: thumb error', e)}
                                />
                            </TemplateBox>
                        )}

                        <Button
                            title={t('profile.portfolio.generateButton')}
                            onPress={() =>
                                navigation.navigate(WEBVIEW, { url: 'https://media-gen-free.emergent.host/' })
                            }
                            height={42}
                            width={SCREEN_WIDTH - 60}
                            style={styles.buttonMargin}
                            color={BLACK}
                        />
                        <Button
                            title={t('profile.portfolio.uploadButton')}
                            onPress={onPickAndUploadMediaKit}
                            height={42}
                            width={SCREEN_WIDTH - 60}
                            style={styles.buttonMargin}
                            color={BLACK}
                        />
                    </TemplateBox>
                )}
                <PortfolioCarousel creatorId={creatorId} />

                <ContactSection contactInfo={contact} socials={socials} paypalLink={paypalLink} email={email} />

                {creatorId && (
                    <TemplateBox selfCenter mv={WRAPPER_MARGIN}>
                        <Button
                            title={t('profile.portfolio.contactButton')}
                            onPress={handleContactCreator}
                            loading={chatLoading}
                            height={50}
                            width={SCREEN_WIDTH - 40}
                            color={BLACK}
                        />
                    </TemplateBox>
                )}
            </ScrollView>
            {loading && <LoadingOverlay message="" />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
    pdfPreview: {
        width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
        height: 300,
        marginBottom: 20,
        borderRadius: 16,
    },
    buttonMargin: {
        marginBottom: 20,
    },
});
export default PortfolioScreen;
