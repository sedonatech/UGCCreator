import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import { chunk } from 'lodash';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK, BRAND_BLUE, DEEP_LAVENDER, WHITE,
} from '../../../theme/Colors';
import {
    HEADER_MARGIN,
    RADIUS_SMALL,
    RADIUS_XSMALL, SPACE_MEDIUM, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';

import { CREATOR_PROJECT_STATUS } from '../../../navigation/ScreenNames';
import CreatorCard from '../creators/CreatorCard';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../consts/content/Portfolio';
import { wp } from '../../../Utils/getResponsiveSize';

const USERS_COLLECTION = 'users';

const ActiveCreatorsScreen = ({ route, navigation }) => {
    const ids = route?.params?.ids;

    const creatorIds = route?.params?.creatorIds;

    const [activeCreators, setActiveCreators] = useState([]);

    const [loading, setLoading] = useState(false);

    const [chunkIndex, setChunkIndex] = useState(0);

    useEffect(() => {
        if (creatorIds) getCreators();
    }, [ids, chunkIndex]);

    const chunks = chunk(ids, 10);
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
            const unique = [...new Map([...activeCreators, ...chunkCreators].map((u) => [u.email, u])).values()];
            setActiveCreators(unique);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const renderFooter = () => {
        if (!activeCreators?.length) return null;
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

    const renderItem = (item) => (
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
    );

    return (
        <View style={styles.container}>
            { !loading && !activeCreators?.length ? (
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
                    data={activeCreators}
                    ListEmptyComponent={(
                        <TemplateBox bottom={10} left="45%">
                            <ActivityIndicator size="small" color={BLACK} />
                        </TemplateBox>
                    )}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={(item, index) => (`${item?.id}-${index}`)}
                    contentContainerStyle={styles.brandsListContentContainer}
                    removeClippedSubviews
                    initialNumToRender={10}
                    ListFooterComponent={renderFooter}
                    ListHeaderComponent={() => (
                        <TemplateText size={16} bold center mt={HEADER_MARGIN}>
                            Active Creators
                        </TemplateText>
                    )}
                />
            )}
        </View>
    );
};

ActiveCreatorsScreen.propTypes = {
    route: PropTypes.shape({}),
    navigation: PropTypes.shape({}),
};

ActiveCreatorsScreen.defaultProps = {
    route: {},
    navigation: {},
};

const styles = {
    container:{
        flex: 1,
    },
    statusCard: {
        marginHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginBottom: 10,
    },
    brandsListContentContainer: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    loading: {
        marginLeft: 4,
    },
    flatList: {
        paddingTop: 100,
    },
};
export default ActiveCreatorsScreen;
