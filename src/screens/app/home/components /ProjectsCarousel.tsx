import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { BRANDS, PROJECTS } from '../../../../consts/content/Home';
import { BLACK_50, BLUE } from '../../../../theme/Colors';
import BrandsCard from './BrandsCard';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import ProjectCard from './ProjectCard';

interface Props {
    style?: any;
}
const ProjectsCarousel: FC<Props> = ({ style }) => (
    <TemplateBox style={style}>
        <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={20}>
            <TemplateText size={18} bold>New Projects</TemplateText>
            <TemplateBox flex />
            {/* @ts-ignore */}
            <TemplateTouchable>
                <TemplateText startCase size={14} underLine color={BLUE}>
                    See All
                </TemplateText>
            </TemplateTouchable>
        </TemplateBox>
        {/* @ts-ignore */}
        <TemplateText size={14} color={BLACK_50} style={styles.subtitle}>
            Check out  new projects from trusted brands
        </TemplateText>

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
    </TemplateBox>
);

const styles = StyleSheet.create({
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    subtitle: {
        marginLeft: WRAPPER_MARGIN,
        marginBottom: 10,
    },
});

export default ProjectsCarousel;
