import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { BLACK, IOS_BLUE } from '../../../../theme/Colors';
import TemplateBox from '../../../../components/TemplateBox';
import ProjectCard from './ProjectCard';
import {
    PROJECT_DETAILS, PROJECTS_SCREEN,
} from '../../../../navigation/ScreenNames';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import { NO_CURRENT_PROJECT_MESSAGE, NO_CURRENT_PROJECT_TITLE } from '../../../../consts/content/Home';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import { projectTypeFilters } from '../../../../consts/AppFilters/ProjectFilters';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';

const ProjectsCarousel = ({ style }) => {
    const { auth } = useAuthContext();
    const { profile } = auth;
    const navigation = useNavigation();

    const { allProjects: projects } = useProjectsContext();

    const carouselData = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        return projects?.map((item) => ({
            id: item?.id,
            image: item?.image,
            title: item?.title,
            shortDescription: item?.shortDescription,
            duration: (!!item?.startDate && !!item?.endDate) ? `${differenceInWeeks(new Date(item?.endDate), new Date(item?.startDate)) || 3} weeks` : 'Ongoing',
            enrolled: item?.applications?.map((app) => app?.creatorId)?.includes(profile?.id),
            projectType: item?.projectType?.length > 0 && projectTypeFilters.find(({ value }) => value === item?.projectType[0])?.name,
        }))?.filter((item) => !!item?.image)?.slice(0, 5);
    }, [projects]);

    return !carouselData ? (
        <ProfileStatusCard
            title={NO_CURRENT_PROJECT_TITLE}
            description={NO_CURRENT_PROJECT_MESSAGE}
            showProgress={false}
            style={styles.statusCard}
            slideInDelay={200}
        />
    ) : (
        <TemplateBox style={style}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={16}>
                <TemplateText size={18} bold>New Projects</TemplateText>
                <TemplateBox flex />
                {/* @ts-ignore */}
                <TemplateTouchable onPress={() => navigation.navigate(PROJECTS_SCREEN)}>
                    <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                        See All
                    </TemplateText>
                </TemplateTouchable>
            </TemplateBox>
            {/* @ts-ignore */}
            <TemplateText size={13} color={BLACK} style={styles.subtitle}>
                Check out  new projects from trusted brands based on your interests and location
            </TemplateText>

            <TemplateCarousel
                data={carouselData}
                renderItem={({ item }) => (
                    <ProjectCard
                        key={item?.id}
                        image={!!item?.image && { uri: item?.image }}
                        title={item?.title}
                        shortDescription={item?.shortDescription}
                        // @ts-ignore
                        onPress={() => navigation.navigate(PROJECT_DETAILS, {
                            projectId: item?.id,
                        })}
                        enrolled={item?.enrolled}
                        style={styles.card}
                        projectType={item?.projectType}
                        duration={item?.duration}
                    />
                )}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={(SCREEN_WIDTH / 2) - 28}
            />
        </TemplateBox>
    );
};

ProjectsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

ProjectsCarousel.defaultProps = {
    style: {},
};

const styles = StyleSheet.create({
    subtitle: {
        marginLeft: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    card: {
        marginRight: 15,

    },
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    statusCard: {
        marginBottom: 20,
    },
});

export default ProjectsCarousel;
