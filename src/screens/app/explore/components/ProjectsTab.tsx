import React from 'react';

import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import ProjectCard from '../../home/components /ProjectCard';
import { PROJECT_DETAILS } from '../../../../navigation/ScreenNames';

const ProjectsTab = (data: { data: any[]; }) => {
    const navigation = useNavigation();

    return (
        <TemplateBox row flexWrap="wrap" ph={WRAPPER_MARGIN} justifyContent="space-between">
            {
                !!data?.data?.length && data?.data?.map((item, index) => (
                    <ProjectCard
                        key={item?.id}
                        image={item?.image}
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

export default ProjectsTab;
