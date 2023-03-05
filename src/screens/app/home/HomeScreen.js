import React from 'react';
import {
    ScrollView, StyleSheet,
} from 'react-native';

import {
    LAVENDER,
    WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import Greeting from './components /Greeting';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Blob from '../../../../assets/svgs/Blob';
import CurrentProjectsCarousel from './components /CurrentProjectsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import ProjectsCarousel from './components /ProjectsCarousel';
import TemplateBox from '../../../components/TemplateBox';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import {
    CURRENT_PROJECTS_CAROUSEL,
    NO_CURRENT_PROJECT_MESSAGE,
    NO_CURRENT_PROJECT_TITLE,
    PROFILE_INCOMPLETE_MESSAGE,
    PROFILE_INCOMPLETE_TITLE,
} from '../../../consts/content/Home';

const HomeScreen = () => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const profileCompleteProgress = 0.4;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>

            {!!profile?.userName && (
                <Greeting userName={profile?.userName} style={styles.greeting} />
            )}

            {
                profileCompleteProgress < 1 && (
                    <ProfileStatusCard
                        title={PROFILE_INCOMPLETE_TITLE}
                        description={PROFILE_INCOMPLETE_MESSAGE}
                        progress={profileCompleteProgress}
                        style={styles.statusCard}
                        slideInDelay={100}
                    />
                )
            }
            {CURRENT_PROJECTS_CAROUSEL?.length ? (
                <CurrentProjectsCarousel style={styles.carousel} />
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
            <BrandsCarousel style={styles.carousel} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    greeting: {
        marginTop: HEADER_MARGIN,
        marginBottom: WRAPPER_MARGIN,
        marginHorizontal: WRAPPER_MARGIN,
    },
    carousel: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
    statusCard: {
        marginVertical: WRAPPER_MARGIN / 2,
    },
});
export default HomeScreen;
