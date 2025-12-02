import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { BLACK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import Greeting from './components /Greeting';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { BRANDS_CATALOGUE, CHALLENGE_DETAILS, PROFILE_STACK } from '../../../navigation/ScreenNames';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import CatalogueSvg from '../../../../assets/svgs/CatalogueSvg';
import { SHADOW } from '../../../theme/Shadow';
import useAppReview from '../../../hooks/useAppReview';
import TemplateIcon from '../../../components/TemplateIcon';
import { wp } from '../../../Utils/getResponsiveSize';
import AffiliateBrandsCarousel from './components /AffiliateBrandsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import EventsCarousel from './components /EventsCarousel';
import useProfile from '../../../hooks/user/useProfile';
import FeaturedShowcaseCarousel from './components /FeaturedSamplesCarousel';
import ChallengeCard from './components /ChallengeCard';
import useChallenge from '../../../hooks/useChallenge';

const HomeScreen = ({ navigation }) => {
    const { auth } = useAuthContext();
    const { features } = useFeatureFlags();
    const brandsCatalogueEnabled = features?.brandsCatalogue?.visible;
    const showAffiliateProgramsCarousel = features?.showAffiliateProgramsCarousel;
    const profile = auth?.profile;
    const { updateProfile } = useProfile();
    const profileImage = profile?.image;
    const isFocused = useIsFocused();
    const { challenge, challengeLoading, getStatusLabel, canEnrollNow } = useChallenge();

    useEffect(() => {
        if (isFocused && profile) {
            auth?.getProfileCompleteStatus();
        }
    }, [isFocused, profile]);

    useEffect(() => {
        const unsubscribe = messaging().onTokenRefresh(token => {
            if (token) updateFcmToken(token);
        });
        return unsubscribe;
    }, []);

    const updateFcmToken = async token => {
        await updateProfile({ fcmToken: token }, profile?.id);
    };

    useEffect(() => {
        if (!profileImage) {
            Alert.alert('Profile image', 'Please upload a profile image to continue', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate(PROFILE_STACK),
                },
            ]);
        }
    }, [profileImage]);

    const { previousResponse, handleRate } = useAppReview();

    const updateLastLogin = async () => {
        await updateProfile({ lastLoginTime: new Date().toUTCString() }, profile?.id);
    };

    useEffect(() => {
        updateLastLogin();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {!!profile?.userName && <Greeting userName={profile?.userName} style={styles.greeting} showAvatar />}
            <ChallengeCard
                onPress={() =>
                    navigation.navigate(CHALLENGE_DETAILS, {
                        challengeId: challenge?.id,
                    })
                }
                loading={challengeLoading}
                prizePoolUsd={challenge?.prizePoolUsd}
                challengeTitle={challenge?.title}
                challengeId={challenge?.id}
                currentUserId={profile?.id}
                shortDescriptionSegments={challenge?.shortDescriptionSegments}
                enrollmentStartAt={challenge?.enrollmentStartAt?.toDate()}
                challengeStartAt={challenge?.challengeStartAt?.toDate()}
                challengeEndAt={challenge?.challengeEndAt?.toDate()}
                getStatusLabel={getStatusLabel}
                canEnrollNow={canEnrollNow}
            />
            {showAffiliateProgramsCarousel && <AffiliateBrandsCarousel style={styles.affiliateBrandsCarousel} />}
            <FeaturedShowcaseCarousel style={styles.showcase} />
            <EventsCarousel />
            {features?.showBrandsCarousel && <BrandsCarousel />}
            {previousResponse === null && features?.showReviewPrompt && (
                <TemplateBox
                    row
                    backgroundColor={WHITE}
                    borderRadius={16}
                    pAll={16}
                    width={WRAPPED_SCREEN_WIDTH}
                    mt={WRAPPER_MARGIN}
                    onPress={handleRate}
                    style={SHADOW('card', WHITE)}
                    selfCenter
                >
                    <TemplateText size={13} onPress={handleRate}>
                        Please take a moment to rate our app
                    </TemplateText>
                    <TemplateBox onPress={handleRate} absolute left={SCREEN_WIDTH - wp(70)} top={wp(8)}>
                        <TemplateIcon name="close-outline" size={20} color={BLACK} />
                    </TemplateBox>
                </TemplateBox>
            )}
            {brandsCatalogueEnabled && (
                <TemplateBox
                    row
                    alignItems="center"
                    backgroundColor={WHITE}
                    borderRadius={16}
                    pAll={20}
                    width={WRAPPED_SCREEN_WIDTH}
                    onPress={() => navigation.navigate(BRANDS_CATALOGUE)}
                    style={SHADOW('card', WHITE)}
                    selfCenter
                    mt={35}
                    mb={20}
                >
                    <CatalogueSvg />
                    <TemplateBox width={16} />
                    <TemplateBox width={SCREEN_WIDTH / 1.6} onPress={() => navigation.navigate(BRANDS_CATALOGUE)}>
                        <TemplateText bold size={16}>
                            Brands Catalogue
                        </TemplateText>
                        <TemplateBox height={10} />
                        <TemplateText size={13}>
                            Discover and explore our extensive catalogue of hundreds of brands
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            )}
        </ScrollView>
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
    greeting: {
        marginTop: HEADER_MARGIN,
        marginBottom: 10,
        marginHorizontal: WRAPPER_MARGIN,
    },
    showcase: {
        marginTop: 12,
        marginBottom: 8,
    },

    affiliateBrandsCarousel: {
        marginVertical: 15,
    },
});
export default HomeScreen;
