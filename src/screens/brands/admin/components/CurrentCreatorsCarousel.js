import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { ACTIVE_CREATORS, CREATOR_PROJECT_STATUS } from '../../../../navigation/ScreenNames';
import { BLACK, BLUE, LIGHT_PURPLE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateBox from '../../../../components/TemplateBox';
import calculateLastLoginTime from '../../../../Utils/calculateLastLoginTime';
import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';
import {
    DEFAULT_CREATOR_SHORT_DESCRIPTION,
    DEFAULT_CREATOR_WORK_SAMPLE_IMAGE,
} from '../../../../consts/content/Portfolio';
import CreatorCard from '../../creators/CreatorCard';
import { wp } from '../../../../Utils/getResponsiveSize';
import useTranslation from '../../../../hooks/useTranslation';

const USERS_COLLECTION = 'users';
const CurrentCreatorsCarousel = ({ style }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const { projects } = useProjectsContext();

    const creatorIds = useMemo(() => {
        if (!projects?.length) return [];

        return projects?.slice(0, 5).reduce((acc, proj) => {
            if (proj?.applications?.length > 0) {
                proj?.applications?.forEach(app => {
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
    const [loading, setLoading] = useState(false);

    // fetch 10 creators for carousel
    useEffect(() => {
        if (ids) getCreators();
    }, [ids]);

    const getCreators = async () => {
        try {
            setLoading(true);
            const querySnapshot = await firestore().collection(USERS_COLLECTION).where('id', 'in', ids).get();

            const chunkCreators = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    lastLoginTime: data?.lastLoginTime ? calculateLastLoginTime(data.lastLoginTime) : 'days ago',
                };
            });
            const unique = [...new Map(chunkCreators.map(u => [u.email, u])).values()];
            setEnrolledCreators(unique);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCreators = useMemo(() => {
        if (!enrolledCreators?.length) return [];
        return enrolledCreators?.sort(() => 0.5 - Math.random()).slice(0, 5);
    }, [enrolledCreators]);

    if (loading) {
        return (
            <View style={[style, styles.loadingContainer]}>
                <ActivityIndicator size="small" color={BLACK} />
            </View>
        );
    }

    return filteredCreators?.length ? (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateBox row justifyContent="space-between">
                    <TemplateText bold size={18} color={BLACK}>
                        {t('brands.admin.carousels.activeCreators.title')}
                    </TemplateText>
                    <TemplateBox />
                    <TemplateTouchable
                        onPress={() =>
                            navigation.navigate(ACTIVE_CREATORS, {
                                creatorIds,
                                ids,
                            })
                        }
                    >
                        <TemplateText startCase size={14} underLine color={BLUE}>
                            {t('brands.admin.carousels.activeCreators.seeAll')}
                        </TemplateText>
                    </TemplateTouchable>
                </TemplateBox>
            </View>

            <TemplateCarousel
                data={filteredCreators}
                renderItem={({ item }) => (
                    <CreatorCard
                        name={item?.userName}
                        imageUrl={item?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE}
                        shortDescription={item?.shortDescription || DEFAULT_CREATOR_SHORT_DESCRIPTION}
                        location={item?.location?.city || item?.location?.country}
                        style={styles.card}
                        width={SCREEN_WIDTH - WRAPPER_MARGIN * 4.6}
                        imageStyle={styles.image}
                        subtitleContainerWidth={94}
                        textContainerWidth="68%"
                        lastLoginTime={item?.lastLoginTime}
                        onPress={() =>
                            navigation.navigate(CREATOR_PROJECT_STATUS, {
                                creatorID: item?.id,
                                projectId: creatorIds?.find(({ creatorId }) => creatorId === item?.id)?.projectID,
                                creatorEmail: item?.contact?.email || item?.email,
                                creatorFCMToken: item?.fcmToken,
                            })
                        }
                        mt={12}
                        ctaText={t('brands.admin.currentCreators.viewProjectStatus')}
                    />
                )}
                snapToInterval={SCREEN_WIDTH - WRAPPER_MARGIN * 4.6 + 20}
                showPagination
                paginationSize={filteredCreators?.length}
                contentContainerStyle={styles.cardCarousel}
            />
        </View>
    ) : (
        <ProfileStatusCard
            title={t('brands.admin.carousels.activeCreators.empty.title')}
            description={t('brands.admin.carousels.activeCreators.empty.description')}
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
        paddingHorizontal: WRAPPER_MARGIN,
        marginTop: WRAPPER_MARGIN / 2,
    },
    cardCarousel: {},
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
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: WRAPPER_MARGIN * 2,
    },
    statusCard: {
        marginBottom: 10,
    },
});
export default CurrentCreatorsCarousel;
