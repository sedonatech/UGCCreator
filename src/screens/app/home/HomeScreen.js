import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import {
    ScrollView, StyleSheet, RefreshControl, Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import {
    BLACK,
    LIGHT_GREEN,
    WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import Greeting from './components /Greeting';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import CurrentProjectsCarousel from './components /CurrentProjectsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import ProjectsCarousel from './components /ProjectsCarousel';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import {
    NO_CURRENT_PROJECT_MESSAGE,
    NO_CURRENT_PROJECT_TITLE,
} from '../../../consts/content/Home';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useRefresh from '../../../hooks/creators/useRefresh';
import RecommendedBrandsCarousel from './components /RecommendedBrandsCarousel';
import HeaderIconButton from '../../../components/header/HeaderButton';
import { BRANDS_CATALOGUE, PROFILE_STACK, UGCAI } from '../../../navigation/ScreenNames';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import CatalogueSvg from '../../../../assets/svgs/CatalogueSvg';
import { SHADOW } from '../../../theme/Shadow';
import useAppReview from '../../../hooks/useAppReview';
import TemplateIcon from '../../../components/TemplateIcon';
import { wp } from '../../../Utils/getResponsiveSize';

const HomeScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const { features } = useFeatureFlags();

    const brandsCatalogueEnabled = features?.brandsCatalogue?.visible;

    const profile = auth?.profile;

    const profileImage = profile?.image;

    const userId = profile?.id;

    const isFocused = useIsFocused();

    const { refreshing, handleRefresh } = useRefresh();

    useEffect(() => {
        if (isFocused && profile) {
            auth?.getProfileCompleteStatus();
        }
    }, [
        isFocused,
        profile,
    ]);

    const { allProjects: projects } = useProjectsContext();

    const userCurrentProjects = useMemo(() => {
        if (!projects?.length) return [];

        return projects.reduce((acc, project) => {
            if (project?.applications?.length) {
                const applicationCreatorIds = project?.applications?.map(
                    ({ creatorId }) => creatorId,
                );

                if (applicationCreatorIds?.length && applicationCreatorIds?.includes(userId)) {
                    acc?.push(project);
                }
            }

            return acc;
        }, []);
    }, [projects, userId]);

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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}
        >

            {!!profile?.userName && (
                <Greeting userName={profile?.userName} style={styles.greeting} />
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
                    mt={WRAPPER_MARGIN}
                    onPress={() => navigation.navigate(BRANDS_CATALOGUE)}
                    style={SHADOW('card', WHITE)}
                    selfCenter
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
            {userCurrentProjects?.length ? (
                <CurrentProjectsCarousel style={styles.carousel} data={userCurrentProjects} />
            )
                : (
                    <ProfileStatusCard
                        title={NO_CURRENT_PROJECT_TITLE}
                        description={NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        style={styles.emptyStatusCard}
                        slideInDelay={200}
                    />
                )}
            <ProjectsCarousel style={styles.carousel} />
            <RecommendedBrandsCarousel style={styles.carousel} />
            <BrandsCarousel style={styles.carousel} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
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
    emptyStatusCard: {
        marginVertical: WRAPPER_MARGIN,
    },
});
export default HomeScreen;
