import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { PROJECTS_CAROUSEL } from '../../../../consts/content/Home';
import { BLACK_50, BLUE } from '../../../../theme/Colors';

import TemplateBox from '../../../../components/TemplateBox';
import ProjectCard from './ProjectCard';
import { EXPLORE, EXPLORE_STACK } from '../../../../navigation/ScreenNames';
import { PROJECTS_TAB } from '../../explore/ExploreScreen';

interface Props {
    style?: any;
}
const ProjectsCarousel: FC<Props> = ({ style }) => {
    const navigation = useNavigation();

    return (
        <TemplateBox style={style}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={20}>
                <TemplateText size={18} bold>New Projects</TemplateText>
                <TemplateBox flex />
                {/* @ts-ignore */}
                <TemplateTouchable onPress={() => navigation.navigate(EXPLORE_STACK, {
                    screen: EXPLORE,
                    params: {
                        initialTab: PROJECTS_TAB,
                    },
                })}
                >
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
                    PROJECTS_CAROUSEL.map((item, index) => (
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
};

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
