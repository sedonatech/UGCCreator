import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { CREATOR_PROJECT_STATUS, OFFERS, OFFERS_STACK } from '../../../../navigation/ScreenNames';
import { BLUE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import CurrentCreatorsCard from './CurrentCreatorsCard';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../../consts/content/Portfolio';

const CurrentCreatorsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const { projects, getEnrolledCreators } = useProjectsContext();

    const creatorIds = useMemo(() => {
        if (!projects?.length) return [];

        return projects?.reduce((acc, proj) => {
            if (proj?.applications?.length > 0) {
                proj?.applications?.forEach((app) => {
                    if (app?.creatorId) {
                        acc.push({ creatorId: app?.creatorId, projectID: proj?.id });
                    }
                });
            }

            return acc;
        }, []);
    }, [projects]);

    const filteredCreators = useMemo(() => {
        if (!creatorIds?.length) return [];

        return getEnrolledCreators(creatorIds?.map(({ creatorId }) => creatorId));
    }, [creatorIds]);

    return filteredCreators?.length ? (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateText bold size={18}>
                    Your Active Creators
                    {' '}
                </TemplateText>
                <TemplateTouchable
                    onPress={() => navigation.navigate(OFFERS_STACK, {
                        screen: OFFERS,
                    })}
                >
                    <TemplateText startCase size={14} underLine color={BLUE}>
                        See All
                    </TemplateText>
                </TemplateTouchable>
            </View>

            <TemplateCarousel
                data={filteredCreators}
                renderItem={({ item }) => (
                    <CurrentCreatorsCard
                        name={item?.userName}
                        image={item?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE}
                        shortDescription={item?.shortDescription}
                        style={styles.card}
                        onPress={() => navigation.navigate(CREATOR_PROJECT_STATUS, {
                            creatorID: item?.id,
                            projectId: creatorIds
                                ?.find(({ creatorId }) => creatorId === item?.id)?.projectID,
                            creatorEmail: item?.contact?.email || item?.email,
                            creatorFCMToken: item?.fcmToken,
                        })}
                    />
                )}
                snapToInterval={SCREEN_WIDTH / 1.3}
                showPagination
                paginationSize={filteredCreators?.length}
                contentContainerStyle={styles.cardCarousel}
            />
        </View>
    ) : (
        <ProfileStatusCard
            title="No active creators"
            description="You don't have any active creators at the moment"
            showProgress={false}
            style={styles.statusCard}
            slideInDelay={200}
        />
    );
};

CurrentCreatorsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

CurrentCreatorsCarousel.defaultProps = {
    style: {},
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: WRAPPER_MARGIN,
        marginVertical: WRAPPER_MARGIN,
    },
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    statusCard: {
        marginTop: WRAPPER_MARGIN,
        marginBottom: 10,
    },
});
export default CurrentCreatorsCarousel;
