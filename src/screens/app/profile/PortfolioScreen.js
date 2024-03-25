import React, { useEffect, useState } from 'react';
import {
    ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
    lightOrange, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    IS_ANDROID, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import PortfolioHeader from './components/PortfolioHeader';
import AboutSection from './components/AboutSection';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { DEFAULT_CREATOR_PAYPAL_LINK } from '../../../consts/content/Portfolio';
import ContactSection from './components/ContactSection';
import SampleWorkSection from './components/SampleWorkSection';
import RatesSection from './components/RatesSection';
import TemplateBox from '../../../components/TemplateBox';
import Button from '../../../components/Button';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { PROFILE_INCOMPLETE_MESSAGE, PROFILE_INCOMPLETE_TITLE } from '../../../consts/content/Home';
import useChatsContext from '../../../hooks/chats/useChatsContext';
import CreatorDetailsHeader from './components/CreatorDetailsHeader';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { UPDATE_PORTFOLIO } from '../../../navigation/ScreenNames';

const USERS_COLLECTION = 'users';
const PortfolioScreen = ({ navigation, route }) => {
    const creatorId = route?.params?.creatorId;
    const [selectedCreator, setSelectedCreator] = useState({});

    useEffect(() => {
        if (creatorId)getProfile();
    }, [creatorId]);

    const getProfile = async () => {
        try {
            const documentSnapshot = await firestore().collection(USERS_COLLECTION).doc(creatorId).get();
            if (documentSnapshot.exists) {
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

    const profileCompleteRatio = auth?.profileCompleteRatio;

    const creator = creatorId ? selectedCreator : auth?.profile;

    const userName = creator?.userName;

    const image = creator?.image;

    const portfolioLink = creator?.portfolioLink;

    const about = creator?.description || '';

    const shortDescription = creator?.shortDescription
      || '';

    const contact = creator?.contact || '';

    const socials = creator?.socialMedia || '';

    const paypalLink = creator?.paypalLink || DEFAULT_CREATOR_PAYPAL_LINK;

    const location = creator?.location?.country || creator?.location?.city;

    const rates = creator?.rates;

    const email = creator?.email;

    const {
        createChatRoom,
    } = useChatsContext();

    const creatorFCMToken = creator?.fcmToken;

    const creatorName = creator?.userName;

    const brandId = auth?.profile?.id;

    const brandFCMToken = auth?.profile?.fcmToken;

    const brandName = auth?.profile?.userName;

    const chatRoomName = `BRAND:${brandName} - CREATOR:${creatorName} chat`;

    const loading = (Object.keys(selectedCreator)?.length === 0) && isBrand;

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {creatorId ? (
                    <CreatorDetailsHeader
                        userName={userName}
                        location={location}
                        image={image}
                    />
                ) : (
                    <PortfolioHeader
                        userName={userName}
                        location={location}
                        creatorId={creatorId}
                        image={image}
                    />
                )}
                { profileCompleteRatio < 1 && !creatorId && (
                    <ProfileStatusCard
                        title={PROFILE_INCOMPLETE_TITLE}
                        description={PROFILE_INCOMPLETE_MESSAGE}
                        progress={profileCompleteRatio}
                        style={styles.statusCard}
                        slideInDelay={40}
                        showIcon={false}
                        backgroundColor={lightOrange}
                        onPress={() => navigation.navigate(UPDATE_PORTFOLIO)}
                    />
                )}
                {about && (
                    <AboutSection
                        about={about}
                        shortDescription={shortDescription}
                        portfolioLink={portfolioLink}
                    />
                )}
                <SampleWorkSection />
                <RatesSection rates={rates} />
                <ContactSection
                    contactInfo={contact}
                    socials={socials}
                    paypalLink={paypalLink}
                    email={email}
                />
                {
                    creatorId
                    && (
                        <TemplateBox selfCenter mv={WRAPPER_MARGIN}>
                            <Button
                                title="Contact Creator"
                                onPress={async () => {
                                    try {
                                        await createChatRoom(
                                            chatRoomName,
                                            creatorId,
                                            brandId,
                                            creatorFCMToken,
                                            brandFCMToken,
                                        );
                                    } catch (e) {
                                        console.log('-> e', e);
                                    }
                                }}
                            />
                        </TemplateBox>
                    )
                }

            </ScrollView>
            {loading && (
                <LoadingOverlay message="" />
            )}
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
    statusCard: {
        marginTop: WRAPPER_MARGIN * 2,
    },
});
export default PortfolioScreen;
