/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { BLACK, BLACK_20, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import Greeting from './components /Greeting';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { BRANDS_CATALOGUE, CHALLENGE_DETAILS, PROFILE_STACK, UGCAI } from '../../../navigation/ScreenNames';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import CatalogueSvg from '../../../../assets/svgs/CatalogueSvg';
import { SHADOW } from '../../../theme/Shadow';
import useAppReview, { markReviewPromptEligibleForTrigger } from '../../../hooks/useAppReview';
import TemplateIcon from '../../../components/TemplateIcon';
import { hp, wp } from '../../../Utils/getResponsiveSize';
import AffiliateBrandsCarousel from './components /AffiliateBrandsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import EventsCarousel from './components /EventsCarousel';
import useProfile from '../../../hooks/user/useProfile';
import FeaturedShowcaseCarousel from './components /FeaturedSamplesCarousel';
import ChallengeCard from './components /ChallengeCard';
import useChallenge from '../../../hooks/useChallenge';
import TemplateCarousel from '../../../components/carousels/TemplateCarousel';
import DynamicIcon from '../../../components/icons/DynamicIcon';
import { WEBVIEW } from '../../../navigation/ScreenNames';
import ProjectsCarousel from './components /ProjectsCarousel';
import useTranslation from '../../../hooks/useTranslation';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const FEEDBACK_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScOnFg0D06OPE5T5w7SZEcy12m9Si0JMAhOAGjGqj5NtMMVgA/viewform?usp=publish-editor';

const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();

    const { auth } = useAuthContext();
    const { features } = useFeatureFlags();
    const brandsCatalogueEnabled = features?.brandsCatalogue?.visible;
    const showAffiliateProgramsCarousel = features?.showAffiliateProgramsCarousel;
    const profile = auth?.profile;
    const profileCompleteRatio = auth?.profileCompleteRatio;
    const { updateProfile } = useProfile();
    const profileImage = profile?.image;
    const isFocused = useIsFocused();
    const { challenges, challengeLoading, getStatusLabel, canEnrollNow } = useChallenge();
    const hasArmedReviewPromptRef = useRef(false);
    const creatorToolsEnabled = features?.openAIScreen;
    const { trackEvent } = useTrackEvent();
    const CHALLENGE_TOAST_DISMISSED_KEY = 'challenge_toast_dismissed';

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TemplateBox>
                    {creatorToolsEnabled && (
                        <TemplateBox
                            onPress={() => {
                                trackEvent('home_ai_tools_tapped');
                                navigation.navigate(UGCAI);
                            }}
                            mr={WRAPPER_MARGIN}
                            alignItems="center"
                            row
                            mb={hp(8)}
                        >
                            <TemplateText size={13} medium color={BLACK} mr={6}>
                                {t('home.aiTools')}
                            </TemplateText>
                            <DynamicIcon name="Edit" size={20} />
                        </TemplateBox>
                    )}

                    <TemplateBox
                        onPress={() => {
                            trackEvent('home_feedback_tapped');
                            markReviewPromptEligibleForTrigger('creator_feedback_sent');
                            navigation.navigate(WEBVIEW, { url: FEEDBACK_FORM_URL });
                        }}
                        mr={WRAPPER_MARGIN}
                        alignItems="center"
                        row
                    >
                        <TemplateText size={13} medium color={BLACK} mr={6}>
                            {t('home.feedback')}
                        </TemplateText>
                        <DynamicIcon name="Comments" size={20} />
                    </TemplateBox>
                </TemplateBox>
            ),
        });
    }, [creatorToolsEnabled, navigation, t]);

    useEffect(() => {
        if (!isFocused || challengeLoading) return;

        const nowMs = Date.now();
        const ongoingChallenges = (challenges ?? []).filter(challenge => {
            const startMs = challenge.challengeStartAt?.toDate?.()?.getTime?.();
            const endMs = challenge.challengeEndAt?.toDate?.()?.getTime?.();
            if (!startMs || !endMs) return false;
            return startMs <= nowMs && nowMs <= endMs;
        });

        if (ongoingChallenges.length === 0) return;

        AsyncStorage.getItem(CHALLENGE_TOAST_DISMISSED_KEY).then(dismissed => {
            if (dismissed) return;

            Toast.show({
                type: 'info',
                text1: t('home.challenges.toastTitle'),
                text2: t('home.challenges.toastMessage'),
                position: 'top',
                visibilityTime: 3500,
                autoHide: true,
                topOffset: 56,
                onPress: () => {
                    AsyncStorage.setItem(CHALLENGE_TOAST_DISMISSED_KEY, 'true');
                    Toast.hide();
                },
            });

            AsyncStorage.setItem(CHALLENGE_TOAST_DISMISSED_KEY, 'true');
        });
    }, [CHALLENGE_TOAST_DISMISSED_KEY, challengeLoading, challenges, isFocused, t]);

    useEffect(() => {
        if (isFocused) {
            trackEvent('screen_viewed', { screen: 'home' });
        }
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
            Alert.alert(t('home.alerts.profileImage.title'), t('home.alerts.profileImage.message'), [
                {
                    text: t('home.alerts.profileImage.ok'),
                    onPress: () => navigation.navigate(PROFILE_STACK),
                },
            ]);
        }
    }, [profileImage, t]);

    const {
        handleRate,
        shouldShowReviewPrompt,
        dismissReviewPrompt,
        markReviewPromptEligible,
        refreshReviewPromptState,
    } = useAppReview();

    useEffect(() => {
        if (isFocused) {
            refreshReviewPromptState();
        }
    }, [isFocused, refreshReviewPromptState]);

    useEffect(() => {
        if (!isFocused || profileCompleteRatio !== 1 || hasArmedReviewPromptRef.current) {
            return;
        }

        hasArmedReviewPromptRef.current = true;
        markReviewPromptEligible('creator_profile_completed');
    }, [isFocused, markReviewPromptEligible, profileCompleteRatio]);

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
                onPress={() => {
                    trackEvent('home_media_kit_tapped');
                    navigation.navigate(PROFILE_STACK);
                }}
                borderWidth={1}
                borderColor={BLACK_20}
            >
                <TemplateBox>
                    <TemplateText size={16} semiBold>
                        {t('home.mediaKit.title')}
                    </TemplateText>
                    <TemplateBox mt={8} maxWidth={SCREEN_WIDTH / 1.5}>
                        <TemplateText size={14}>{t('home.mediaKit.description')}</TemplateText>
                    </TemplateBox>
                </TemplateBox>
                <DynamicIcon name={'ArrowRight'} size={24} />
            </TemplateBox>

            <TemplateCarousel
                data={challenges}
                renderItem={({ item }) => (
                    <ChallengeCard
                        onPress={() => {
                            trackEvent('home_challenge_tapped', { challengeId: item?.id });
                            navigation.navigate(CHALLENGE_DETAILS, {
                                challengeId: item?.id,
                            });
                        }}
                        secondaryOnPress={() => {
                            trackEvent('home_challenge_tapped', { challengeId: item?.id });
                            navigation.navigate(CHALLENGE_DETAILS, {
                                challengeId: item?.id,
                            });
                        }}
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
            <ProjectsCarousel />
            <EventsCarousel />
            {features?.showBrandsCarousel && <BrandsCarousel />}
            {shouldShowReviewPrompt && features?.showReviewPrompt && (
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
                        {t('home.alerts.appReview')}
                    </TemplateText>
                    <TemplateBox onPress={dismissReviewPrompt} absolute left={SCREEN_WIDTH - wp(70)} top={wp(8)}>
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
                    onPress={() => {
                        trackEvent('home_brands_catalogue_tapped');
                        navigation.navigate(BRANDS_CATALOGUE);
                    }}
                    style={SHADOW('card', WHITE)}
                    selfCenter
                    mt={35}
                    mb={20}
                >
                    <CatalogueSvg />
                    <TemplateBox width={16} />
                    <TemplateBox
                        width={SCREEN_WIDTH / 1.6}
                        onPress={() => {
                            trackEvent('home_brands_catalogue_tapped');
                            navigation.navigate(BRANDS_CATALOGUE);
                        }}
                    >
                        <TemplateText bold size={16}>
                            {t('home.brandsCatalogue.title')}
                        </TemplateText>
                        <TemplateBox height={10} />
                        <TemplateText size={13}>{t('home.brandsCatalogue.description')}</TemplateText>
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
