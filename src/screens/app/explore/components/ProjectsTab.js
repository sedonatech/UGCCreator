import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import ProjectCard from '../../home/components /ProjectCard';
import { PROJECT_DETAILS } from '../../../../navigation/ScreenNames';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';

const ProjectsTab = (id) => {
    const navigation = useNavigation();

    const { allProjects } = useProjectsContext();

    const brandProjects = useMemo(() => {
        if (!allProjects?.length) return [];

        return allProjects?.filter((project) => project?.brandId === id?.id);
    }, [allProjects, id?.id]);

    return (
        <TemplateBox row flexWrap="wrap" ph={WRAPPER_MARGIN} justifyContent="space-between" flex>
            {
                !!brandProjects?.length && brandProjects?.map((item, index) => (
                    <ProjectCard
                        key={item?.id}
                        image={{ uri: item?.image }}
                        title={item?.title}
                        shortDescription={item?.shortDescription}
                        slideInDelay={(index + 1) * 100}
                        // @ts-ignore
                        onPress={() => navigation.navigate(PROJECT_DETAILS, {
                            projectId: item?.id,
                        })}
                    />
                ))
            }
        </TemplateBox>

    );
};

ProjectsTab.propTypes = {
    id: PropTypes.shape({
        id: PropTypes.string,
    }),
};
export default ProjectsTab;
