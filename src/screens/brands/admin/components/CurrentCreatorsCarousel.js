import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import firestore from '@react-native-firebase/firestore';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import {
    ACTIVE_CREATORS,
    CREATOR_PROJECT_STATUS,
} from '../../../../navigation/ScreenNames';
import { BLUE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import { SCREEN_WIDTH, SPACE_MEDIUM, WRAPPER_MARGIN } from '../../../../theme/Layout';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';
import {
    DEFAULT_CREATOR_WORK_SAMPLE_IMAGE,
} from '../../../../consts/content/Portfolio';
import CreatorCard from '../../creators/CreatorCard';
import { wp } from '../../../../Utils/getResponsiveSize';

const USERS_COLLECTION = 'users';
const CurrentCreatorsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const { projects } = useProjectsContext();

    const creatorIds = useMemo(() => {
        if (!projects?.length) return [];

        return projects?.slice(0, 5).reduce((acc, proj) => {
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

    const ids = useMemo(() => creatorIds?.map(({ creatorId }) => creatorId), [creatorIds]);
    const [enrolledCreators, setEnrolledCreators] = useState([]);

    // fetch 10 creators for carousel
    useEffect(() => {
        if (ids) getCreators();
    }, [ids]);

    const getCreators = async () => {
        try {
            const querySnapshot = await firestore()
                .collection(USERS_COLLECTION)
                .where('id', 'in', ids)
                .get();

            const chunkCreators = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const unique = [...new Map(chunkCreators.map((u) => [u.email, u])).values()];
            setEnrolledCreators(unique);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredCreators = useMemo(() => {
        if (!enrolledCreators?.length) return [];
        return enrolledCreators?.sort(() => 0.5 - Math.random()).slice(0, 5);
    }, [enrolledCreators]);

    return filteredCreators?.length ? (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateText bold size={18}>
                    Your Active Creators
                    {' '}
                </TemplateText>
                <TemplateTouchable
                    onPress={() => navigation.navigate(ACTIVE_CREATORS,
                        {
                            creatorIds,
                            ids,
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
                    <CreatorCard
                        name={item?.userName}
                        imageUrl={item?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE}
                        shortDescription={item?.shortDescription}
                        location={item?.location?.country}
                        email={item?.email}
                        style={styles.card}
                        onPress={() => navigation.navigate(CREATOR_PROJECT_STATUS, {
                            creatorID: item?.id,
                            projectId: creatorIds
                                ?.find(({ creatorId }) => creatorId === item?.id)?.projectID,
                            creatorEmail: item?.contact?.email || item?.email,
                            creatorFCMToken: item?.fcmToken,
                        })}
                        height={wp(194)}
                        mt={SPACE_MEDIUM}
                        ctaText="View Project Status"
                    />

                )}
                snapToInterval={(SCREEN_WIDTH / 1.3) + 80}
                showPagination
                paginationSize={filteredCreators?.length}
                contentContainerStyle={styles.cardCarousel}
            />
        </View>
    ) : (
        <ProfileStatusCard
            title="No Active Creators"
            description="You don't have any active creators that you are working with at the moment"
            showProgress={false}
            showIcon={false}
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
        marginBottom: 10,
    },
});
export default CurrentCreatorsCarousel;
