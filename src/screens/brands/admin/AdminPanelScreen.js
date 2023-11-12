import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import {
    ScrollView, StyleSheet, RefreshControl, Alert,
} from 'react-native';
import differenceInDays from 'date-fns/differenceInDays';
import { useIsFocused } from '@react-navigation/native';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK,
    BLACK_SECONDARY, lightOrange,
    WHITE,
} from '../../../theme/Colors';
import TemplateTouchable from '../../../components/TemplateTouchable';
import {
    ADD_PROJECT, BRAND_PROJECT_DETAILS, PROFILE_STACK, UPDATE_BRAND_PROFILE,
} from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Greeting from '../../app/home/components /Greeting';
import { HEADER_MARGIN, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import CurrentCreatorsCarousel from './components/CurrentCreatorsCarousel';
import FeaturedCreatorsCarousel from './components/FeaturedCreatorsCarousel';
import ActiveProjectsCarousel from './components/ActiveProjectsCarousel';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import {
    BRAND_NO_CURRENT_PROJECT_MESSAGE,
    BRAND_NO_CURRENT_PROJECT_TITLE, BRAND_PROFILE_INCOMPLETE_MESSAGE,
    BRAND_PROFILE_INCOMPLETE_TITLE,
} from '../../../consts/content/Home';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import useRefresh from '../../../hooks/creators/useRefresh';
import TemplateBox from '../../../components/TemplateBox';
import { SHADOW } from '../../../theme/Shadow';
import { wp } from '../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../components/TemplateIcon';
import useAppReview from '../../../hooks/useAppReview';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';

const AdminPanelScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const profileImage = profile?.image;

    const profileCompleteRatio = auth?.profileCompleteRatio;

    const isFocused = useIsFocused();

    const { projects } = useProjectsContext();

    const brandName = profile?.name;

    const { refreshing, handleBrandRefresh } = useRefresh();

    const { features } = useFeatureFlags();

    const projectsCarouselData = useMemo(() => {
        if (!projects?.length) return [];
        return projects?.map((project) => ({
            id: project?.id,
            title: project?.title,
            brand: brandName,
            price: project?.price,
            status: project?.applications?.length ? 'Enrolled Creators' : 'No Enrolled Creators',
            notifications: project?.applications?.length || 0,
            documents: project?.applications?.[0]?.documents?.length || 0,
            daysLeft: differenceInDays(new Date(project?.endDate), new Date(project?.startDate)),
            onPress: () => navigation.navigate(BRAND_PROJECT_DETAILS, {
                projectId: project?.id,
            }),
        }));
    }, [projects]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TemplateTouchable
                    style={styles.addButton}
                    onPress={() => navigation.navigate(ADD_PROJECT)}
                >
                    <TemplateText bold caps size={10} color={WHITE}>
                        Add project
                    </TemplateText>
                </TemplateTouchable>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (isFocused && profile) {
            auth?.getProfileCompleteStatus();
        }
    }, [
        isFocused,
        profile,
    ]);

    useEffect(() => {
        if (!profileImage) {
            Alert.alert(
                'Profile image',
                'Please upload a profile image to continue',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate(PROFILE_STACK),
                    },
                ],
            );
        }
    }, [profileImage]);

    const { previousResponse, handleRate } = useAppReview();

    return (
        <ScrollView
            style={styles.container}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleBrandRefresh}
                />
            )}
            showsVerticalScrollIndicator={false}
        >
            {profile?.name && (
                <Greeting userName={profile?.name} style={styles.greeting} showAvatar={false} />
            )}
            {previousResponse === null && features?.showReviewPrompt && (
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
                        Please take a moment to rate our app
                    </TemplateText>
                    <TemplateBox
                        onPress={handleRate}
                        ml={wp(60)}
                        mt={-wp(8)}
                    >
                        <TemplateIcon
                            name="close-outline"
                            size={20}
                            color={BLACK}

                        />
                    </TemplateBox>
                </TemplateBox>
            )}
            <CurrentCreatorsCarousel style={styles.carousel} />
            <FeaturedCreatorsCarousel style={styles.carousel} />
            { profileCompleteRatio < 1 && (
                <ProfileStatusCard
                    title={BRAND_PROFILE_INCOMPLETE_TITLE}
                    description={BRAND_PROFILE_INCOMPLETE_MESSAGE}
                    progress={profileCompleteRatio}
                    style={styles.statusCard}
                    slideInDelay={40}
                    showIcon={false}
                    backgroundColor={lightOrange}
                    onPress={() => navigation.navigate(UPDATE_BRAND_PROFILE)}
                />
            )}

            {
                projectsCarouselData?.length ? (
                    <ActiveProjectsCarousel
                        style={styles.carousel}
                        projectsCarouselData={projectsCarouselData}
                    />
                ) : (
                    <ProfileStatusCard
                        title={BRAND_NO_CURRENT_PROJECT_TITLE}
                        description={BRAND_NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        showIcon={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                    />
                )
            }
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: wp(60),
    },
    addButton: {
        marginRight: 20,
        height: 30,
        borderRadius: 10,
        backgroundColor: BLACK_SECONDARY,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    greeting: {
        marginTop: HEADER_MARGIN,
        marginBottom: WRAPPER_MARGIN,
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
