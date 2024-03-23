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

    RADIUS_XSMALL,
    SCREEN_WIDTH, SPACE_MEDIUM, SPACE_XSMALL, WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import CurrentCreatorsCard from './CurrentCreatorsCard';
import { CREATOR_PROJECT_STATUS } from '../../../../navigation/ScreenNames';
import {
    BLACK, DEEP_LAVENDER, WHITE,
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
            // const creators = [];
            // for (const chunk of chunks) {
            //     const querySnapshot = await firestore()
            //         .collection(USERS_COLLECTION)
            //         .where('id', 'in', chunk)
            //         .get();
            //     const chunkCreators = querySnapshot.docs.map((doc) => ({
            //         id: doc.id,
            //         ...doc.data(),
            //     }));
            //     creators.push(...chunkCreators);
            // }
            const querySnapshot = await firestore()
                .collection(USERS_COLLECTION)
                .where('id', 'in', chunks?.[chunkIndex])
                .get();
            const chunkCreators = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEnrolledCreators([...enrolledCreators, ...chunkCreators]);
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
                borderRadius={RADIUS_XSMALL}
                backgroundColor={DEEP_LAVENDER}
                width={120}
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
                    loading && <ActivityIndicator color={WHITE} size="small" style={{ marginLeft: 4 }} />
                }
            </TemplateBox>
        );
    };

    return (
        <TemplateBox>
            { !loading && !enrolledCreators?.length ? (
                <ProfileStatusCard
                    title="No enrolled creators"
                    description="You have not enrolled any creators to this project yet."
                    showProgress={false}
                    style={styles.statusCard}
                    slideInDelay={200}
                />
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={enrolledCreators}
                    ListEmptyComponent={(
                        <TemplateBox bottom={10} left="45%">
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
                                creatorEmail: item?.contact?.email,
                                creatorFCMToken: item?.fcmToken,
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
        backgroundColor: DEEP_LAVENDER,
        marginVertical: SPACE_XSMALL,
    },
    brandsListContentContainer: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
export default EnrolledCreators;
