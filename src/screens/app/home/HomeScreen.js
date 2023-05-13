import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import {
    ScrollView, StyleSheet, RefreshControl,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import {
    BLACK_10, lightOrange,
    WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN,
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
    NO_CURRENT_PROJECT_TITLE, PROFILE_INCOMPLETE_MESSAGE, PROFILE_INCOMPLETE_TITLE,
} from '../../../consts/content/Home';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useRefresh from '../../../hooks/creators/useRefresh';
import RecommendedBrandsCarousel from './components /RecommendedBrandsCarousel';
import HeaderIconButton from '../../../components/header/HeaderButton';
import { UGCAI } from '../../../navigation/ScreenNames';

const HomeScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const profileCompleteRatio = auth?.profileCompleteRatio;

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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    title="Creator tools"
                    onPress={() => navigation.navigate(UGCAI)}
                    backDropColor={BLACK_10}
                    mr={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

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

            { profileCompleteRatio < 1 && (
                <ProfileStatusCard
                    title={PROFILE_INCOMPLETE_TITLE}
                    description={PROFILE_INCOMPLETE_MESSAGE}
                    progress={profileCompleteRatio}
                    style={styles.statusCard}
                    slideInDelay={40}
                    showIcon={false}
                    backgroundColor={profileCompleteRatio < 0.5 ? lightOrange : WHITE}
                />
            )}
            {userCurrentProjects?.length ? (
                <CurrentProjectsCarousel style={styles.carousel} data={userCurrentProjects} />
            )
                : (
                    <ProfileStatusCard
                        title={NO_CURRENT_PROJECT_TITLE}
                        description={NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        style={styles.statusCard}
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
        marginBottom: WRAPPER_MARGIN,
        marginHorizontal: WRAPPER_MARGIN,
    },
    carousel: {
        flex: 1,
        marginBottom: WRAPPER_MARGIN,
    },
    statusCard: {
        marginBottom: WRAPPER_MARGIN,
    },
});
export default HomeScreen;
