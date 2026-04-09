/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, RefreshControl, View, TouchableWithoutFeedback } from 'react-native';
import differenceInDays from 'date-fns/differenceInDays';
import { useIsFocused } from '@react-navigation/native';
import { getMessaging } from '@react-native-firebase/messaging';
import TemplateText from '../../../components/TemplateText';
import { BLACK, LAVENDER, WHITE } from '../../../theme/Colors';
import { ADD_EVENT, ADD_PROJECT, BRAND_PROJECT_DETAILS } from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Greeting from '../../app/home/components /Greeting';
import { HEADER_MARGIN, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import CurrentCreatorsCarousel from './components/CurrentCreatorsCarousel';
import FeaturedCreatorsCarousel from './components/FeaturedCreatorsCarousel';
import ActiveProjectsCarousel from './components/ActiveProjectsCarousel';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import useRefresh from '../../../hooks/creators/useRefresh';
import TemplateBox from '../../../components/TemplateBox';
import { SHADOW } from '../../../theme/Shadow';
import { hp, wp } from '../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../components/TemplateIcon';
import useAppReview from '../../../hooks/useAppReview';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import BrandEventsCarousel from '../../app/home/components /BrandEventsCarousel';
import HeaderIconButton from '../../../components/header/HeaderButton';
import useProfile from '../../../hooks/user/useProfile';
import FeaturedShowcaseCarousel from '../../app/home/components /FeaturedSamplesCarousel';
import useTranslation from '../../../hooks/useTranslation';

const AdminPanelScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { auth } = useAuthContext();
    const profile = auth?.profile;
    const profileCompleteRatio = auth?.profileCompleteRatio;
    const { updateProfile } = useProfile();
    const [refetchProjects, setRefetchProjects] = useState(null);
    const isFocused = useIsFocused();
    const { projects, getProjects } = useProjectsContext();
    const hasArmedReviewPromptRef = useRef(false);

    useEffect(() => {
        getProjects();
    }, [refetchProjects]);

    const brandName = profile?.name;

    const { refreshing, handleBrandRefresh } = useRefresh();

    const { features } = useFeatureFlags();

    const projectsCarouselData = useMemo(() => {
        if (!projects?.length) return [];
        return projects?.slice(0, 5)?.map(project => ({
            id: project?.id,
            title: project?.title,
            description: project?.description,
            brand: brandName,
            image: project?.image,
            price: project?.price,
            status: project?.applications?.length
                ? t('brands.admin.carousels.activeProjects.enrolledCreators')
                : t('brands.admin.carousels.activeProjects.noEnrolledCreators'),
            notifications: project?.applications?.length || 0,
            documents: project?.applications?.[0]?.documents?.length || 0,
            daysLeft: differenceInDays(new Date(project?.endDate), new Date(project?.startDate)),
            onPress: () =>
                navigation.navigate(BRAND_PROJECT_DETAILS, {
                    projectId: project?.id,
                }),
        }));
    }, [projects]);

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
        });
    }, [navigation, showOptions]);

    useEffect(() => {
        if (isFocused && profile) {
            auth?.getProfileCompleteStatus();
        }
    }, [isFocused, profile]);

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
        markReviewPromptEligible('brand_profile_completed');
    }, [isFocused, markReviewPromptEligible, profileCompleteRatio]);

    const options = [
        {
            title: t('brands.admin.panel.addProject'),
            onPress: () => {
                setShowOptions(false);
                navigation.navigate(ADD_PROJECT, { setRefetchProjects });
            },
        },
        {
            title: t('brands.admin.panel.addEvent'),
            onPress: () => {
                setShowOptions(false);
                navigation.navigate(ADD_EVENT);
            },
        },
    ];

    useEffect(() => {
        const unsubscribe = getMessaging().onTokenRefresh(token => {
            if (token) updateFcmToken(token);
        });
        return unsubscribe;
    }, []);

    const updateFcmToken = async token => {
        await updateProfile({ fcmToken: token }, profile?.id);
    };

    const updateLastLogin = async () => {
        await updateProfile({ lastLoginTime: new Date().toISOString() }, profile?.id);
    };

    useEffect(() => {
        updateLastLogin();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.container}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleBrandRefresh} />}
                    showsVerticalScrollIndicator={false}
                >
                    {profile?.name && <Greeting userName={profile?.name} style={styles.greeting} showAvatar={false} />}
                    {shouldShowReviewPrompt && features?.showReviewPrompt && (
                        <TemplateBox
                            row
                            backgroundColor={WHITE}
                            borderRadius={16}
                            pAll={16}
                            width={WRAPPED_SCREEN_WIDTH}
                            mv={WRAPPER_MARGIN}
                            onPress={handleRate}
                            style={SHADOW('card', WHITE)}
                            selfCenter
                        >
                            <TemplateText size={13} onPress={handleRate}>
                                {t('brands.admin.panel.ratePrompt')}
                            </TemplateText>
                            <TemplateBox onPress={dismissReviewPrompt} ml={wp(60)} mt={-wp(8)}>
                                <TemplateIcon name="close-outline" size={20} color={BLACK} />
                            </TemplateBox>
                        </TemplateBox>
                    )}
                    <CurrentCreatorsCarousel style={styles.carousel} />
                    <FeaturedCreatorsCarousel style={styles.carousel} />
                    <FeaturedShowcaseCarousel style={styles.carousel} />
                    <BrandEventsCarousel brandId={profile?.id} />
                    {projectsCarouselData?.length ? (
                        <ActiveProjectsCarousel style={styles.carousel} projectsCarouselData={projectsCarouselData} />
                    ) : (
                        <ProfileStatusCard
                            title={t('brands.admin.panel.noCurrentProject.title')}
                            description={t('brands.admin.panel.noCurrentProject.message')}
                            showProgress={false}
                            showIcon={false}
                            style={styles.statusCard}
                            slideInDelay={200}
                        />
                    )}
                </ScrollView>
                {showOptions && (
                    <View
                        style={{
                            position: 'absolute',
                            right: WRAPPER_MARGIN * 3.2,
                            top: HEADER_MARGIN * 0.85,
                            zIndex: 99,
                        }}
                    >
                        {options?.map(({ title, onPress }, index) => (
                            <TemplateBox
                                key={`option-${index}`}
                                zIndex={99}
                                backgroundColor={LAVENDER}
                                mb={hp(8)}
                                borderRadius={hp(8)}
                                fadeIn
                                slideInTime={160 + index * 100}
                                slideIn
                                slideInX={20}
                                debug
                            >
                                <TemplateBox onPress={onPress} ph={12} pv={8}>
                                    <TemplateText size={hp(12)} semiBold>
                                        {title}
                                    </TemplateText>
                                </TemplateBox>
                            </TemplateBox>
                        ))}
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: wp(60),
    },
    greeting: {
        marginTop: HEADER_MARGIN,
        marginBottom: 10,
        marginHorizontal: WRAPPER_MARGIN,
    },
    carousel: {
        marginBottom: WRAPPER_MARGIN,
    },
    statusCard: {
        marginBottom: WRAPPER_MARGIN,
    },
});
export default AdminPanelScreen;
