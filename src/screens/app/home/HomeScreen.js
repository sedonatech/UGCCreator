import React, { useEffect, useMemo } from 'react';
import {
    ScrollView, StyleSheet, RefreshControl,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
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
    NO_CURRENT_PROJECT_MESSAGE,
    NO_CURRENT_PROJECT_TITLE,
    PROFILE_INCOMPLETE_MESSAGE,
    PROFILE_INCOMPLETE_TITLE,
} from '../../../consts/content/Home';
import { UPDATE_PORTFOLIO } from '../../../navigation/ScreenNames';
import ProfileIncompleteModal from '../../../components/modals/ProfileIncompleteModal';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useRefresh from '../../../hooks/creators/useRefresh';

const HomeScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const userId = profile?.id;

    const isFocused = useIsFocused();

    const modalVisible = auth?.completeProfileModalVisible;

    const { refreshing, handleRefresh } = useRefresh();

    const closeModal = () => {
        auth?.closeCompleteProfileModal();
        navigation.navigate(UPDATE_PORTFOLIO);
    };

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

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}
        >
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>

            {!!profile?.userName && (
                <Greeting userName={profile?.userName} style={styles.greeting} />
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
            <BrandsCarousel style={styles.carousel} />
            {/* <ProfileIncompleteModal */}
            {/*    visible={modalVisible} */}
            {/*    closeOnPress={closeModal} */}
            {/*    title={PROFILE_INCOMPLETE_TITLE} */}
            {/*    subtitle={PROFILE_INCOMPLETE_MESSAGE} */}
            {/*    buttonTitle="Complete Portfolio" */}
            {/* /> */}
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
        marginBottom: WRAPPER_MARGIN,
    },
    statusCard: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default HomeScreen;
