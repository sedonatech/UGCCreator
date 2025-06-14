import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import {
    ScrollView, StyleSheet, Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {
    BLACK,
    LIGHT_GREEN, TRANSPARENT,
    WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import Greeting from './components /Greeting';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import RecommendedBrandsCarousel from './components /RecommendedBrandsCarousel';
import HeaderIconButton from '../../../components/header/HeaderButton';
import {
    BRANDS_CATALOGUE, FEED_DETAILS, PROFILE_STACK, UGCAI,
} from '../../../navigation/ScreenNames';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import CatalogueSvg from '../../../../assets/svgs/CatalogueSvg';
import { SHADOW } from '../../../theme/Shadow';
import useAppReview from '../../../hooks/useAppReview';
import TemplateIcon from '../../../components/TemplateIcon';
import { wp } from '../../../Utils/getResponsiveSize';
import FeedsTab from '../explore/components/FeedsTab';
import FeedCard from '../explore/components/FeedCard';
import getIconByType from '../../../Utils/getIconByType';
import AffiliateBrandsCarousel from './components /AffiliateBrandsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import EventsCarousel from './components /EventsCarousel';
import useProfile from '../../../hooks/user/useProfile';
import FeaturedCreatorsCarousel from '../../brands/admin/components/FeaturedCreatorsCarousel';
import ProjectsCarousel from './components /ProjectsCarousel';
import EmergingBrandsCarousel from './components /EmergingBrandsCarousel';

const HomeScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { features, feed } = useFeatureFlags();

    const brandsCatalogueEnabled = features?.brandsCatalogue?.visible;

    const profile = auth?.profile;
    const { updateProfile } = useProfile();

    const profileImage = profile?.image;

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && profile) {
            auth?.getProfileCompleteStatus();
        }
    }, [
        isFocused,
        profile,
    ]);

    useEffect(() => {
        const unsubscribe = messaging().onTokenRefresh((token) => {
            if (token) updateFcmToken(token);
        });
        return unsubscribe;
    }, []);

    const updateFcmToken = async (token) => {
        await updateProfile({ fcmToken: token }, profile?.id);
    };

    const creatorToolsEnabled = features?.openAIScreen;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    title="Creator tools"
                    onPress={() => (creatorToolsEnabled ? navigation.navigate(UGCAI) : null)}
                    backDropColor={LIGHT_GREEN}
                    mr={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation, creatorToolsEnabled]);

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

    const ugcGuidePdfFeed = useMemo(() => {
        if (!feed?.feeds?.length) return [];

        return feed?.feeds?.[0];
    }, [feed]);

    const updateLastLogin = async () => {
        await updateProfile({ lastLoginTime: new Date().toISOString() }, profile?.id);
    };

    useEffect(() => {
        updateLastLogin();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            // refreshControl={(
            //     <RefreshControl
            //         refreshing={refreshing}
            //         onRefresh={handleRefresh}
            //     />
            // )}
        >

            {!!profile?.userName && (
                <Greeting userName={profile?.userName} style={styles.greeting} />
            )}

            <TemplateBox height={236}>
                <AffiliateBrandsCarousel />
            </TemplateBox>
            {features?.showEmergingBrandsCarousel && (
                <TemplateBox height={236} mt={40}>
                    <EmergingBrandsCarousel />
                </TemplateBox>
            )}
            <ProjectsCarousel style={styles.projectsCarousel} />
            <EventsCarousel />
            {features?.showBrandsCarousel && (
                <TemplateBox height={236} mb={12}>
                    <BrandsCarousel />
                </TemplateBox>
            )}

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
                    <TemplateBox
                        onPress={handleRate}
                        absolute
                        left={SCREEN_WIDTH - wp(70)}
                        top={wp(8)}
                    >
                        <TemplateIcon
                            name="close-outline"
                            size={20}
                            color={BLACK}

                        />
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
                    <TemplateBox
                        width={SCREEN_WIDTH / 1.6}
                        onPress={() => navigation.navigate(BRANDS_CATALOGUE)}
                    >
                        <TemplateText bold size={16}>Brands Catalogue</TemplateText>
                        <TemplateBox height={10} />
                        <TemplateText size={13}>
                            Discover and explore our extensive catalogue of hundreds of brands
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            )}
            <FeaturedCreatorsCarousel style={styles.carousel} creator />

            {!!ugcGuidePdfFeed?.title && (
                <TemplateBox mt={wp(20)} mb={wp(10)}>
                    <FeedCard
                        image={{ uri: ugcGuidePdfFeed?.thumbnail }}
                        title={ugcGuidePdfFeed?.title}
                        shortDescription={ugcGuidePdfFeed?.description}
                        subtitle={ugcGuidePdfFeed?.subtitle}
                        showGradient
                        cardWidth={SCREEN_WIDTH / 1.12}
                        aspectRatio={1.5}
                        icon={getIconByType(ugcGuidePdfFeed?.type)}
                        onPress={() => navigation.navigate(FEED_DETAILS,
                            {
                                selectedFeed: ugcGuidePdfFeed,
                            })}
                        style={styles.card}
                    />
                </TemplateBox>
            )}
            <RecommendedBrandsCarousel style={styles.carousel} />
            <FeedsTab />

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
    carousel: {
        flex: 1,
        marginBottom: WRAPPER_MARGIN,
    },
    projectsCarousel: {
        flex: 1,
        marginTop: WRAPPER_MARGIN,
    },

    card: {
        marginBottom: 10,
        alignSelf: 'center',
    },
});
export default HomeScreen;
