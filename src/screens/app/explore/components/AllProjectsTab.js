import React from 'react';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import ProjectCard from '../../home/components /ProjectCard';
import { PROJECT_DETAILS } from '../../../../navigation/ScreenNames';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import { wp } from '../../../../Utils/getResponsiveSize';

const AllProjectsTab = ({ projects }) => {
    const navigation = useNavigation();
    const { auth } = useAuthContext();
    const { profile } = auth;

    return (
        <TemplateBox row flexWrap="wrap" ph={WRAPPER_MARGIN} justifyContent="space-between" flex>
            {
                !!projects?.length && projects?.map((item, index) => (
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
                        enrolled={
                            item?.applications?.map((app) => app?.creatorId)?.includes(profile?.id)
                        }
                        duration={item?.duration}
                        projectType={item?.projectType}
                        style={styles.container}
                    />
                ))
            }
        </TemplateBox>

    );
};

AllProjectsTab.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        shortDescription: PropTypes.string,
        image: PropTypes.string,
    })),
};

AllProjectsTab.defaultProps = {
    projects: [],
};

const styles = StyleSheet.create({
    container: {
        marginBottom: wp(20),
    },
});

export default AllProjectsTab;
