import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { BLACK, BLACK_20, TRANSPARENT, WHITE } from '../../../theme/Colors';
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
import TemplateCarousel from '../../../components/carousels/TemplateCarousel';
import DynamicIcon from '../../../components/icons/DynamicIcon';

const HomeScreen = ({ navigation }) => {
    const { auth } = useAuthContext();
    const { features } = useFeatureFlags();
    const brandsCatalogueEnabled = features?.brandsCatalogue?.visible;
    const showAffiliateProgramsCarousel = features?.showAffiliateProgramsCarousel;
    const profile = auth?.profile;
    const { updateProfile } = useProfile();
    const profileImage = profile?.image;
    const isFocused = useIsFocused();
    const { challenges, challengeLoading, getStatusLabel, canEnrollNow } = useChallenge();
    const hasShownOngoingChallengeToastRef = useRef(false);

    useEffect(() => {
        if (!isFocused) {
            hasShownOngoingChallengeToastRef.current = false;
            return;
        }
        if (challengeLoading) return;
        const nowMs = Date.now();
        const ongoingChallenges = (challenges ?? []).filter(challenge => {
            const startMs = challenge.challengeStartAt?.toDate?.()?.getTime?.();
            const endMs = challenge.challengeEndAt?.toDate?.()?.getTime?.();
            if (!startMs || !endMs) return false;
            return startMs <= nowMs && nowMs <= endMs;
        });

        if (ongoingChallenges.length === 0) return;
        if (hasShownOngoingChallengeToastRef.current) return;

        hasShownOngoingChallengeToastRef.current = true;

        Toast.show({
            type: 'info',
            text1: 'Challenges are live',
            text2: 'Add your submissions now.',
            position: 'top',
            visibilityTime: 3500,
            autoHide: true,
            topOffset: 56,
        });
    }, [isFocused, challengeLoading, challenges]);

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

            <TemplateBox
                pAll={WRAPPER_MARGIN}
                mv={20}
                mh={WRAPPER_MARGIN}
                row
                alignItems="center"
                justifyContent="space-between"
                borderRadius={16}
                onPress={() => navigation.navigate(PROFILE_STACK)}
                borderWidth={1}
                borderColor={BLACK_20}
            >
                <TemplateBox>
                    <TemplateText size={16} semiBold>
                        Generate Media Kit
                    </TemplateText>
                    <TemplateBox mt={8} maxWidth={SCREEN_WIDTH / 1.5}>
                        <TemplateText size={14}>
                            Upload a one page PDF with your work. Brands can preview it on your profile, update it any
                            time.
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
                <DynamicIcon name={'ArrowRight'} size={24} />
            </TemplateBox>

            <TemplateCarousel
                data={challenges}
                renderItem={({ item }) => (
                    <ChallengeCard
                        onPress={() =>
                            navigation.navigate(CHALLENGE_DETAILS, {
                                challengeId: item?.id,
                            })
                        }
                        secondaryOnPress={() =>
                            navigation.navigate(CHALLENGE_DETAILS, {
                                challengeId: item?.id,
                            })
                        }
                        loading={challengeLoading}
                        prizePoolUsd={item?.prizePoolUsd}
                        challengeTitle={item?.title}
                        challengeId={item?.id}
                        currentUserId={profile?.id}
                        userName={profile?.userName}
                        userEmail={profile?.email}
                        shortDescriptionSegments={item?.shortDescriptionSegments}
                        enrollmentStartAt={item?.enrollmentStartAt?.toDate()}
                        challengeStartAt={item?.challengeStartAt?.toDate()}
                        challengeEndAt={item?.challengeEndAt?.toDate()}
                        getStatusLabel={getStatusLabel}
                        canEnrollNow={canEnrollNow}
                        width={WRAPPED_SCREEN_WIDTH - 10}
                        mr={16}
                    />
                )}
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
