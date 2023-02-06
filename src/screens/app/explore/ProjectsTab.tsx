import React from 'react';
import { StyleSheet } from 'react-native';

import TemplateBox from '../../../components/TemplateBox';
import { PROJECTS } from '../../../consts/content/Home';
import { WRAPPER_MARGIN } from '../../../theme/Layout';
import ProjectCard from '../home/components /ProjectCard';

const ProjectsTab = () => (
    <TemplateBox row flexWrap="wrap" ph={WRAPPER_MARGIN} justifyContent="space-between">
        {
            PROJECTS.map((item, index) => (
                <ProjectCard
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    shortDescription={item.shortDescription}
                />
            ))
        }
    </TemplateBox>
);

const styles = StyleSheet.create({
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    }
});

export default ProjectsTab;
