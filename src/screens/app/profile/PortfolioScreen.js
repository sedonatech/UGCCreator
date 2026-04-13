import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
import { BLACK, BLACK_60, BRAND_BLUE, GREY_30, IOS_BLUE, TRANSPARENT, WHITE } from '../../../theme/Colors';
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
import TemplateIcon from '../../../components/TemplateIcon';
import PillTag from '../../../components/PillTag';
import { CHAT_ROOM, CHATS, MEDIA_KIT, UPDATE_PORTFOLIO, WEBVIEW } from '../../../navigation/ScreenNames';
import useProfile from '../../../hooks/user/useProfile';
import ContactSection from './components/ContactSection';
import useTranslation from '../../../hooks/useTranslation';

const USERS_COLLECTION = 'users';

const SectionHeader = ({ icon, title, iconFamily }) => (
    <TemplateBox row alignItems="center" mb={12}>
        <TemplateBox
            width={32}
            height={32}
            borderRadius={10}
            backgroundColor={BRAND_BLUE + '25'}
            alignItems="center"
            justifyContent="center"
            mr={10}
        >
            <TemplateIcon name={icon} size={16} family={iconFamily || 'Ionicons'} color={BRAND_BLUE} />
        </TemplateBox>
        <TemplateText bold size={17} color={BLACK}>
            {title}
        </TemplateText>
    </TemplateBox>
);

SectionHeader.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    iconFamily: PropTypes.string,
};

SectionHeader.defaultProps = {
    iconFamily: 'Ionicons',
};

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
    const isOwner = !creatorId || creatorId === auth?.profile?.id;
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

    const shortDescription = (creator?.shortDescription || '').trim();
    const description = (creator?.description || '').trim();
    const portfolioLink = (creator?.portfolioLink || '').trim();
    const brands = Array.isArray(creator?.brands)
        ? creator.brands.filter(b => b && typeof b === 'object' && (b.name || '').trim())
        : [];
    const categories = Array.isArray(creator?.categories)
        ? creator.categories.filter(c => typeof c === 'string' && c.trim())
        : [];

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
        if (!creatorId || !brandId) {
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
                name: chatName || '',
                creatorId,
                brandId,
                createdAt: serverTimestamp(),
                creatorFCMToken: creatorFCMToken || null,
                brandFCMToken: brandFCMToken || null,
                lastMessageTimestamp: serverTimestamp(),
            });

            if (newRoom?.id) {
                navigateToChat(newRoom.id, chatName, creatorFCMToken);
            }
        } catch (e) {
            console.error('[CONTACT CREATOR ERROR]', e);
            Alert.alert(
                t('chats.alerts.userNotAvailable.title') || 'Error',
                t('chats.alerts.userNotAvailable.message') || 'Could not start chat. Please try again.',
            );
        } finally {
            setChatLoading(false);
        }
    };

    const pickPdf = async () => {
        const res = await DocumentPicker.pickSingle({
            type: [types.pdf],
            copyTo: 'cachesDirectory',
        });

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

    const hasAbout = !!shortDescription || !!description;
    const hasBrands = brands.length > 0;
    const hasCategories = categories.length > 0;
    const hasContact = !!(
        contact?.phoneNumber ||
        contact?.email ||
        email ||
        socials?.instagram ||
        socials?.facebook ||
        socials?.twitter ||
        socials?.linkedin
    );

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

                {/* Edit Profile Button — owner only */}
                {isOwner && !isBrand && (
                    <TemplateBox selfCenter mt={16} mb={8}>
                        <TemplateBox
                            row
                            center
                            onPress={() => navigation.navigate(UPDATE_PORTFOLIO)}
                            backgroundColor={BLACK}
                            borderRadius={12}
                            ph={24}
                            pv={12}
                        >
                            <TemplateIcon name="create-outline" size={18} family="Ionicons" color={WHITE} />
                            <TemplateText color={WHITE} bold size={14} style={styles.editButtonText}>
                                {t('profile.portfolio.editProfile') || 'Edit Profile'}
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>
                )}

                {/* About Section */}
                {hasAbout && (
                    <TemplateBox
                        mh={WRAPPER_MARGIN}
                        mt={20}
                        backgroundColor={WHITE}
                        borderRadius={16}
                        pAll={20}
                        style={styles.card}
                    >
                        <SectionHeader icon="person-outline" title={t('profile.portfolio.aboutMe') || 'About Me'} />
                        {!!shortDescription && (
                            <TemplateText size={14} color={BLACK} lineHeight={22} bold>
                                {shortDescription}
                            </TemplateText>
                        )}
                        {!!description && (
                            <TemplateText size={14} color={BLACK_60} lineHeight={22} mt={8}>
                                {description}
                            </TemplateText>
                        )}
                        {!!portfolioLink && (
                            <TemplateBox row alignItems="center" mt={12}>
                                <TemplateIcon name="link-outline" size={16} family="Ionicons" color={IOS_BLUE} />
                                <TemplateText
                                    color={IOS_BLUE}
                                    size={13}
                                    style={styles.portfolioLink}
                                    numberOfLines={1}
                                    onPress={() => navigation.navigate(WEBVIEW, { url: portfolioLink })}
                                >
                                    {portfolioLink}
                                </TemplateText>
                            </TemplateBox>
                        )}
                    </TemplateBox>
                )}

                {/* Brands Worked With */}
                {hasBrands && (
                    <TemplateBox
                        mh={WRAPPER_MARGIN}
                        mt={16}
                        backgroundColor={WHITE}
                        borderRadius={16}
                        pAll={20}
                        style={styles.card}
                    >
                        <SectionHeader
                            icon="briefcase-outline"
                            title={t('profile.portfolio.brandsWorkedWith') || 'Brands Worked With'}
                        />
                        <TemplateBox row flexWrap="wrap">
                            {brands.map((b, index) => (
                                <TemplateBox
                                    key={`brand-${index}`}
                                    row
                                    alignItems="center"
                                    backgroundColor={BRAND_BLUE + '18'}
                                    borderRadius={20}
                                    ph={14}
                                    pv={8}
                                    mr={8}
                                    mb={8}
                                >
                                    <TemplateIcon
                                        name="business-outline"
                                        size={14}
                                        family="Ionicons"
                                        color={BRAND_BLUE}
                                    />
                                    <TemplateText size={13} bold color={BLACK} style={styles.brandChipText}>
                                        {b?.name}
                                    </TemplateText>
                                </TemplateBox>
                            ))}
                        </TemplateBox>
                    </TemplateBox>
                )}

                {/* Preferred Categories */}
                {hasCategories && (
                    <TemplateBox
                        mh={WRAPPER_MARGIN}
                        mt={16}
                        backgroundColor={WHITE}
                        borderRadius={16}
                        pAll={20}
                        style={styles.card}
                    >
                        <SectionHeader
                            icon="pricetags-outline"
                            title={t('profile.portfolio.preferredCategories') || 'Preferred Categories'}
                        />
                        <TemplateBox row flexWrap="wrap">
                            {categories.map((category, index) => (
                                <PillTag key={`cat-${index}`} primaryTransparent>
                                    {category}
                                </PillTag>
                            ))}
                        </TemplateBox>
                    </TemplateBox>
                )}

                {/* Media Kit — owner only */}
                {!creatorId && (
                    <TemplateBox
                        mh={WRAPPER_MARGIN}
                        mt={16}
                        backgroundColor={WHITE}
                        borderRadius={16}
                        pAll={20}
                        style={styles.card}
                    >
                        <SectionHeader
                            icon="document-text-outline"
                            title={t('profile.portfolio.mediaKitTitle') || 'Media Kit'}
                        />
                        <TemplateText size={13} color={BLACK_60} mb={14}>
                            {t('profile.portfolio.mediaKitDescription')}
                        </TemplateText>
                        {!!profile?.mediaKit?.url && (
                            <TemplateBox
                                onPress={() =>
                                    navigation.navigate(MEDIA_KIT, {
                                        uri: profile?.mediaKit?.url,
                                        cacheFileName: `${profile?.id}-media-kit.pdf`,
                                    })
                                }
                                mb={16}
                            >
                                <Pdf
                                    source={{
                                        uri: profile?.mediaKit?.url,
                                        cache: true,
                                        cacheFileName: `${profile?.id}-media-kit.pdf`,
                                    }}
                                    page={1}
                                    singlePage
                                    fitPolicy={0}
                                    spacing={0}
                                    trustAllCerts={false}
                                    scrollEnabled
                                    style={styles.pdfPreview}
                                    onError={e => console.log('[MEDIA-KIT]: thumb error', e)}
                                />
                            </TemplateBox>
                        )}
                        <Button
                            title={t('profile.portfolio.generateButton')}
                            onPress={() =>
                                navigation.navigate(WEBVIEW, {
                                    url: 'https://ugccreator-media-kit-generator.onrender.com/',
                                })
                            }
                            height={42}
                            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2 - 40}
                            style={styles.buttonMargin}
                            color={BLACK}
                        />
                        <Button
                            title={t('profile.portfolio.uploadButton')}
                            onPress={onPickAndUploadMediaKit}
                            height={42}
                            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2 - 40}
                            color={BLACK}
                        />
                    </TemplateBox>
                )}

                {/* Sample Work Carousel */}
                <PortfolioCarousel creatorId={creatorId} />

                {/* Contact Section */}
                {hasContact && (
                    <ContactSection contactInfo={contact} socials={socials} paypalLink={paypalLink} email={email} />
                )}

                {/* Contact Creator Button — brand view only */}
                {creatorId && isBrand && (
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

                <TemplateBox height={40} />
            </ScrollView>
            {loading && <LoadingOverlay message="" />}
        </>
    );
};

PortfolioScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
    route: PropTypes.shape({
        params: PropTypes.shape({
            creatorId: PropTypes.string,
        }),
    }),
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
        backgroundColor: GREY_30,
    },
    card: {
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    pdfPreview: {
        width: SCREEN_WIDTH - WRAPPER_MARGIN * 2 - 40,
        height: 300,
        borderRadius: 12,
    },
    buttonMargin: {
        marginBottom: 12,
    },
    editButtonText: {
        marginLeft: 8,
    },
    portfolioLink: {
        marginLeft: 6,
        flex: 1,
    },
    brandChipText: {
        marginLeft: 6,
    },
});
export default PortfolioScreen;
