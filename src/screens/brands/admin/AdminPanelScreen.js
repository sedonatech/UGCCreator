import React, {
    useCallback,
    useEffect, useLayoutEffect, useMemo, useState,
} from 'react';
import {
    ScrollView, StyleSheet, RefreshControl,
    Alert,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import differenceInDays from 'date-fns/differenceInDays';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK,
    BLACK_SECONDARY,
    LAVENDER,
    WHITE,
} from '../../../theme/Colors';
import {
    ADD_EVENT,
    ADD_PROJECT, BRAND_PROJECT_DETAILS,
    BRANDS_PROFILE_STACK,
    UPDATE_BRAND_PROFILE,
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
    BRAND_NO_CURRENT_PROJECT_TITLE,
} from '../../../consts/content/Home';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import useRefresh from '../../../hooks/creators/useRefresh';
import TemplateBox from '../../../components/TemplateBox';
import { SHADOW } from '../../../theme/Shadow';
import { hp, wp } from '../../../Utils/getResponsiveSize';
import TemplateIcon from '../../../components/TemplateIcon';
import useAppReview from '../../../hooks/useAppReview';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { DEFAULT_BRAND_DESCRIPTION } from '../../../consts/content/Portfolio';
import BrandEventsCarousel from '../../app/home/components /BrandEventsCarousel';
import HeaderIconButton from '../../../components/header/HeaderButton';
import useProfile from '../../../hooks/user/useProfile';

const AdminPanelScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;
    const { updateProfile } = useProfile();
    const [refetchProjects, setRefetchProjects] = useState(null);

    const profileImage = profile?.image;
    const defaultDescription = profile.description === DEFAULT_BRAND_DESCRIPTION;

    const isFocused = useIsFocused();

    const { projects, getProjects } = useProjectsContext();

    useEffect(() => {
        getProjects();
    }, [refetchProjects]);

    const brandName = profile?.name;

    const { refreshing, handleBrandRefresh } = useRefresh();

    const { features } = useFeatureFlags();

    const projectsCarouselData = useMemo(() => {
        if (!projects?.length) return [];
        return projects?.slice(0, 5)?.map((project) => ({
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
    }, [
        isFocused,
        profile,
    ]);

    const { previousResponse, handleRate } = useAppReview();

    useFocusEffect(
        useCallback(() => {
            if (!profileImage || defaultDescription) {
                Alert.alert(
                    'Update Profile',
                    (!!profile && defaultDescription)
                        ? 'Please update your brand description from the default description to improve your brand identification'
                        : 'Please upload a profile image & brand description to improve your brand identification',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate(BRANDS_PROFILE_STACK, {
                                screen: UPDATE_BRAND_PROFILE,
                            }),
                        },
                    ],
                );
            }
        }, [profileImage, defaultDescription, navigation]),
    );

    const options = [
        {
            title: 'Add Project',
            onPress: () => {
                setShowOptions(false);
                navigation.navigate(ADD_PROJECT, { setRefetchProjects });
            },
        },
        {
            title: 'Add Event',
            onPress: () => {
                setShowOptions(false);
                navigation.navigate(ADD_EVENT);
            },
        },
    ];

    useEffect(() => {
        const unsubscribe = messaging().onTokenRefresh((token) => {
            if (token) updateFcmToken(token);
        });
        return unsubscribe;
    }, []);

    const updateFcmToken = async (token) => {
        await updateProfile({ fcmToken: token }, profile?.id);
    };

    const updateLastLogin = async () => {
        await updateProfile({ lastLoginTime: new Date().toISOString() }, profile?.id);
    };

    useEffect(() => {
        updateLastLogin();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)} style={{ backgroundColor: 'red', flex: 1 }}>
            <View style={{ flex: 1 }}>
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
                    <BrandEventsCarousel brandId={profile?.id} />
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
                {showOptions
            && (
                <View
                    style={{
                        position: 'absolute',
                        right: WRAPPER_MARGIN,
                        top: HEADER_MARGIN * 0.85,
                        zIndex: 99,
                    }}
                >
                    {
                        options?.map(({ title, onPress }, index) => (
                            <TemplateBox
                                key={index}
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
                                <TemplateBox
                                    onPress={onPress}
                                    ph={12}
                                    pv={8}
                                >
                                    <TemplateText size={hp(12)} semiBold>
                                        {title}
                                    </TemplateText>
                                </TemplateBox>
                            </TemplateBox>
                        ))
                    }
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
    addButton: {
        marginRight: 20,
        height: 30,
        borderRadius: 10,
        backgroundColor: BLACK_SECONDARY,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    eventButton: {
        marginLeft: 20,
        height: 30,
        borderRadius: 10,
        backgroundColor: BLACK_SECONDARY,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
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
