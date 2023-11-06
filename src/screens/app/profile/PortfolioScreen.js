import React, { useLayoutEffect, useRef } from 'react';
import {
    ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

import {
    BLACK_10, lightOrange, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    IS_ANDROID, SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import PortfolioHeader from './components/PortfolioHeader';
import AboutSection from './components/AboutSection';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { DEFAULT_CREATOR_PAYPAL_LINK } from '../../../consts/content/Portfolio';
import ContactSection from './components/ContactSection';
import SampleWorkSection from './components/SampleWorkSection';
import RatesSection from './components/RatesSection';
import HeaderIconButton from '../../../components/header/HeaderButton';
import useShareScreenShot from '../../../Utils/useShareScreenShot';
import useGetCreators from '../../../hooks/brands/useGetCreators';
import TemplateBox from '../../../components/TemplateBox';
import Button from '../../../components/Button';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { PROFILE_INCOMPLETE_MESSAGE, PROFILE_INCOMPLETE_TITLE } from '../../../consts/content/Home';
import useChatsContext from '../../../hooks/chats/useChatsContext';

const PortfolioScreen = ({ navigation, route }) => {
    const creatorId = route?.params?.creatorId;

    const { selectedCreator } = useGetCreators(creatorId);

    const { auth } = useAuthContext();

    const isCreator = auth?.profile?.type === 'creator';

    const profileCompleteRatio = auth?.profileCompleteRatio;

    const creator = selectedCreator || auth?.profile;

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

    const screenshot = useRef(null);

    const [shareScreenshot] = useShareScreenShot(userName, screenshot);

    const handleShare = async () => {
        await shareScreenshot();
    };

    useLayoutEffect(() => {
        if (!creatorId) {
            navigation.setOptions({
                headerLeft: () => (
                    <HeaderIconButton
                        name="share-outline"
                        onPress={handleShare}
                        backDropColor={BLACK_10}
                        ml={WRAPPER_MARGIN}
                    />
                ),
            });
        }
    }, [navigation, creatorId]);

    const {
        createChatRoom,
    } = useChatsContext();

    const creatorFCMToken = creator?.fcmToken;

    const creatorName = creator?.userName;

    const brandId = auth?.profile?.id;

    const brandFCMToken = auth?.profile?.fcmToken;

    const brandName = auth?.profile?.userName;

    const chatRoomName = `BRAND:${brandName} - CREATOR:${creatorName} chat`;

    return (
        <ViewShot style={styles.viewShot} ref={screenshot}>
            {!selectedCreator || (isCreator && !auth?.profile) ? (
                <TemplateBox absolute top={SCREEN_HEIGHT / 2.2} left={SCREEN_WIDTH / 2.2}>
                    <ActivityIndicator size="large" />
                </TemplateBox>
            ) : (
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <PortfolioHeader
                        userName={userName}
                        location={location}
                        creatorId={creatorId}
                        image={image}
                    />
                    { profileCompleteRatio < 1 && !creatorId && (
                        <ProfileStatusCard
                            title={PROFILE_INCOMPLETE_TITLE}
                            description={PROFILE_INCOMPLETE_MESSAGE}
                            progress={profileCompleteRatio}
                            style={styles.statusCard}
                            slideInDelay={40}
                            showIcon={false}
                            backgroundColor={lightOrange}
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
                                            if (creatorId && brandId && creatorFCMToken && brandFCMToken && chatRoomName) {
                                                await createChatRoom(
                                                    chatRoomName,
                                                    creatorId,
                                                    brandId,
                                                    creatorFCMToken,
                                                    brandFCMToken,
                                                );
                                            }
                                        } catch (e) {
                                            console.log('-> e', e);
                                        }
                                    }}
                                />
                            </TemplateBox>
                        )
                    }
                </ScrollView>
            )}
        </ViewShot>
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
    viewShot: {
        flex: 1,
    },
    statusCard: {
        marginTop: WRAPPER_MARGIN * 2,
    },
});
export default PortfolioScreen;
