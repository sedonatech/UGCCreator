import React from 'react';

import TemplateBox from '../../../components/TemplateBox';
import { WRAPPER_MARGIN } from '../../../theme/Layout';
import ProjectCard from '../home/components /ProjectCard';

const ProjectsTab = (data: { data: any[]; }) => (
    <TemplateBox row flexWrap="wrap" ph={WRAPPER_MARGIN} justifyContent="space-between">
        {
            !!data?.data?.length && data?.data?.map((item, index) => (
                <ProjectCard
                    key={item?.id}
                    image={item?.image}
                    title={item?.title}
                    shortDescription={item?.shortDescription}
                    slideInDelay={(index + 1) * 100}
                />
            ))
        }
    </TemplateBox>
);

export default ProjectsTab;
