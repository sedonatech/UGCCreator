import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import CurrentCreatorsCard from './CurrentCreatorsCard';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import { CREATOR_PROJECT_STATUS } from '../../../../navigation/ScreenNames';

const EnrolledCreators = ({ creatorIds, projectId }) => {
    const navigation = useNavigation();

    const { getEnrolledCreators } = useProjectsContext();

    const enrolledCreators = useMemo(() => {
        if (!creatorIds) return [];
        return getEnrolledCreators(creatorIds);
    }, [creatorIds]);

    return (
        <TemplateBox ph={WRAPPER_MARGIN}>
            { !enrolledCreators?.length ? (
                <ProfileStatusCard
                    title="No enrolled creators"
                    description="You have not enrolled any creators to this project yet."
                    showProgress={false}
                    style={styles.statusCard}
                    slideInDelay={200}
                />
            )
                : enrolledCreators?.map((item) => (
                    <CurrentCreatorsCard
                        key={item?.id}
                        name={item?.userName}
                        image={item?.image}
                        shortDescription={item?.shortDescription}
                        style={styles.card}
                        cardWidth={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                        aspectRatio={1.5}
                        onPress={() => navigation.navigate(CREATOR_PROJECT_STATUS, {
                            creatorID: item?.id,
                            projectId,
                            creatorEmail: item?.contact?.email,
                        })}
                    />
                ))}
        </TemplateBox>
    );
};

EnrolledCreators.propTypes = {
    creatorIds: PropTypes.arrayOf(PropTypes.string),
    projectId: PropTypes.string,
};

EnrolledCreators.defaultProps = {
    creatorIds: [],
    projectId: '',
};

const styles = StyleSheet.create({
    statusCard: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default EnrolledCreators;
