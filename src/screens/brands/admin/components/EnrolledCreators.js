import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, FlatList, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';
import {
    RADIUS_SMALL,

    RADIUS_XSMALL,
    SCREEN_WIDTH, SPACE_MEDIUM, SPACE_XSMALL, WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import CurrentCreatorsCard from './CurrentCreatorsCard';
import { CREATOR_PROJECT_STATUS, PROFILE } from '../../../../navigation/ScreenNames';
import {
    BLACK, BRAND_BLUE, DEEP_LAVENDER, WHITE,
} from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';

const USERS_COLLECTION = 'users';
const EnrolledCreators = ({ creatorIds, projectId }) => {
    const navigation = useNavigation();

    const [enrolledCreators, setEnrolledCreators] = useState([]);

    const [loading, setLoading] = useState(false);

    const [chunkIndex, setChunkIndex] = useState(0);

    useEffect(() => {
        if (creatorIds) getCreators();
    }, [creatorIds, chunkIndex]);

    const chunks = chunk(creatorIds, 10);
    const getCreators = async () => {
        try {
            setLoading(true);

            const querySnapshot = await firestore()
                .collection(USERS_COLLECTION)
                .where('id', 'in', chunks?.[chunkIndex])
                .get();
            const chunkCreators = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const unique = [...new Map([...enrolledCreators, ...chunkCreators]?.map((u) => [u.email, u])).values()];
            setEnrolledCreators(unique);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const renderFooter = () => {
        if (!enrolledCreators?.length) return null;
        return (
            <TemplateBox
                alignItems="center"
                justifyContent="center"
                borderRadius={RADIUS_SMALL}
                backgroundColor={BLACK}
                width={140}
                height={30}
                mv={SPACE_MEDIUM}
                onPress={() => setChunkIndex((prev) => prev + 1)}
                selfCenter
                row
            >
                <TemplateText color={WHITE} bold size={12}>
                    Show More
                </TemplateText>
                {
                    loading && <ActivityIndicator color={WHITE} size="small" style={styles.loading} />
                }
            </TemplateBox>
        );
    };

    return (
        <TemplateBox>
            { !loading && !enrolledCreators?.length ? (
                <ProfileStatusCard
                    title="No enrolled creators"
                    description="No creators enrolled to this project yet."
                    showProgress={false}
                    style={styles.statusCard}
                    slideInDelay={200}
                />
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={enrolledCreators}
                    ListEmptyComponent={(
                        <TemplateBox bottom={10}>
                            <ActivityIndicator size="small" color={BLACK} />
                        </TemplateBox>
                    )}
                    renderItem={({ item }) => (
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
                                creatorEmail: item?.contact?.email || item?.email,
                                creatorFCMToken: item?.fcmToken,
                            })}
                            onViewCreatorPress={() => navigation.navigate(PROFILE, {
                                creatorId: item?.id,
                            })}
                        />
                    )}
                    keyExtractor={(item, index) => (`${item?.id}-${index}`)}
                    contentContainerStyle={styles.brandsListContentContainer}
                    removeClippedSubviews
                    initialNumToRender={10}
                    ListFooterComponent={renderFooter}
                />
            )}
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
    card: {
        backgroundColor: BRAND_BLUE,
        marginVertical: SPACE_XSMALL,
    },
    brandsListContentContainer: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
export default EnrolledCreators;
