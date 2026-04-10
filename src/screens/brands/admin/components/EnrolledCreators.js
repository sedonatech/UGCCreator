import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';
import useTranslation from '../../../../hooks/useTranslation';
import { RADIUS_SMALL, SCREEN_WIDTH, SPACE_MEDIUM, WRAPPER_MARGIN } from '../../../../theme/Layout';
import CreatorCard from '../../creators/CreatorCard';
import { CREATOR_PROJECT_STATUS } from '../../../../navigation/ScreenNames';
import { BLACK, LIGHT_PURPLE, WHITE } from '../../../../theme/Colors';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../../consts/content/Portfolio';
import { wp } from '../../../../Utils/getResponsiveSize';
import TemplateText from '../../../../components/TemplateText';
import calculateLastLoginTime from '../../../../Utils/calculateLastLoginTime';

const USERS_COLLECTION = 'users';
const EnrolledCreators = ({ creatorIds, projectId }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [enrolledCreators, setEnrolledCreators] = useState([]);

    const [loading, setLoading] = useState(false);

    const [chunkIndex, setChunkIndex] = useState(0);

    useEffect(() => {
        if (creatorIds?.length) getCreators();
    }, [creatorIds, chunkIndex]);

    const chunks = chunk(creatorIds, 10);
    const getCreators = async () => {
        const currentChunk = chunks?.[chunkIndex];
        if (!currentChunk?.length) return;
        try {
            setLoading(true);

            const querySnapshot = await firestore().collection(USERS_COLLECTION).where('id', 'in', currentChunk).get();
            const chunkCreators = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            const unique = [...new Map([...enrolledCreators, ...chunkCreators]?.map(u => [u.email, u])).values()];
            setEnrolledCreators(unique);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const hasMoreChunks = chunkIndex < chunks.length - 1;

    const renderFooter = () => {
        if (!hasMoreChunks || !enrolledCreators?.length) return null;
        return (
            <TemplateBox
                alignItems="center"
                justifyContent="center"
                borderRadius={RADIUS_SMALL}
                backgroundColor={BLACK}
                width={140}
                height={30}
                mv={SPACE_MEDIUM}
                onPress={() => setChunkIndex(prev => prev + 1)}
                selfCenter
                row
            >
                <TemplateText color={WHITE} bold size={12}>
                    {t('brands.admin.activeCreators.showMore')}
                </TemplateText>
                {loading && <ActivityIndicator color={WHITE} size="small" style={styles.loading} />}
            </TemplateBox>
        );
    };

    return (
        <TemplateBox>
            {!loading && !enrolledCreators?.length ? (
                <ProfileStatusCard
                    title={t('brands.admin.enrolledCreators.empty.title')}
                    description={t('brands.admin.enrolledCreators.empty.description')}
                    showProgress={false}
                    style={styles.statusCard}
                    slideInDelay={200}
                />
            ) : (
                <TemplateBox style={styles.brandsListContentContainer}>
                    {!enrolledCreators?.length ? (
                        <TemplateBox bottom={10}>
                            <ActivityIndicator size="small" color={BLACK} />
                        </TemplateBox>
                    ) : (
                        <>
                            {enrolledCreators.map((item, index) => (
                                <CreatorCard
                                    key={`${item?.id}-${index}`}
                                    name={item?.userName}
                                    imageUrl={item?.image}
                                    shortDescription={item?.shortDescription || DEFAULT_CREATOR_SHORT_DESCRIPTION}
                                    location={item?.location?.city || item?.location?.country}
                                    style={styles.card}
                                    width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                                    imageStyle={styles.image}
                                    subtitleContainerWidth={94}
                                    textContainerWidth="68%"
                                    lastLoginTime={
                                        item?.lastLoginTime ? calculateLastLoginTime(item.lastLoginTime) : 'days ago'
                                    }
                                    ctaText="View Project Status"
                                    onPress={() =>
                                        navigation.navigate(CREATOR_PROJECT_STATUS, {
                                            creatorID: item?.id,
                                            projectId,
                                            creatorEmail: item?.contact?.email || item?.email,
                                            creatorFCMToken: item?.fcmToken,
                                        })
                                    }
                                    mt={12}
                                    mh={0}
                                />
                            ))}
                            {renderFooter()}
                        </>
                    )}
                </TemplateBox>
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
        backgroundColor: LIGHT_PURPLE,
        marginRight: 0,
    },
    image: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(16),
        marginRight: wp(14),
    },
    brandsListContentContainer: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default EnrolledCreators;
