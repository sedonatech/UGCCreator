import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import moment from 'moment';

import TemplateText from '../../../components/TemplateText';
import {
    BRAND_BLUE, GREEN, LAVENDER, PINK, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import {
    HEADER_MARGIN,
    IS_ANDROID, SCREEN_WIDTH, SPACE_LARGE, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    NO_CURRENT_PROJECT_MESSAGE,
    NO_CURRENT_PROJECT_TITLE,
} from '../../../consts/content/Home';
import CurrentProjectCard from '../home/components /CurrentProjectCard';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { CURRENT_PROJECT_DETAILS } from '../../../navigation/ScreenNames';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import useGetBrands from '../../../hooks/creators/useGetBrands';
import { projectStatuses } from '../../../consts/AppFilters/ProjectStatus';

const getTagColor = (status) => {
    if (status === 'backlog') {
        return BRAND_BLUE;
    } if (status === 'inProgress') {
        return PINK;
    } if (status === 'inReview') {
        return LAVENDER;
    } if (status === 'completed') {
        return GREEN;
    }
    return BRAND_BLUE;
};
const OffersScreen = ({ navigation }) => {
    const { allProjects: projects } = useProjectsContext();
    const { brands } = useGetBrands();
    const { auth } = useAuthContext();
    const { profile } = auth;

    const enrolledProjects = useMemo(() => {
        if (!projects) return [];

        const enrolled = projects?.reduce((acc, proj) => {
            proj?.applications?.forEach((app) => {
                if (app?.creatorId === profile?.id) {
                    acc.push(proj);
                }
            });

            return acc;
        }, []);

        if (enrolled?.length) {
            return enrolled?.map((item) => {
                const application = item?.applications?.length
                    ? item?.applications?.find(({ creatorId }) => creatorId === profile?.id)
                    : {};
                const completedStatuses = projectStatuses?.filter(({ status }) => status === 'completed');

                const progress = completedStatuses?.length
                    ? Math.round((completedStatuses?.length / projectStatuses?.length) * 10) / 10
                    : 0;
                return {
                    ...item,
                    ...application,
                    progress,
                    id: item?.id,
                    title: item?.title,
                    brand: brands?.find(({ id }) => id === item?.brandId)?.name,
                    price: `From ${item?.priceRange?.max} to ${item?.priceRange?.min} ${item?.currency}`,
                    status: application?.status?.filter(({ status }) => status === 'active')[0]?.name,
                    documentCount: application?.documents?.length,
                    daysLeft: moment(item?.endDate).diff(moment(), 'days'),
                    currentStatus: application?.status?.filter(({ status }) => status === 'active')[0]?.name,
                };
            });
        }
        return [];
    }, [projects, profile]);

    return (
        <ScrollView style={styles.container}>
            <TemplateBox
                mt={HEADER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    startCase
                    bold
                >
                    Check the status of your offers
                </TemplateText>
            </TemplateBox>

            {
                enrolledProjects?.length ? enrolledProjects.map((item, index) => (
                    <CurrentProjectCard
                        title={item?.title}
                        brand={item?.brand}
                        price={item?.price}
                        status={item?.status}
                        notificationCount={item?.notifications}
                        documentCount={item?.documents}
                        daysLeft={item?.daysLeft}
                        progress={item?.progress}
                        style={styles.card}
                        cardColor={getTagColor(item?.currentStatus?.value)}
                        width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                        slideInDelay={(index + 1) * 100}
                        key={item?.id}
                        onPress={
                            () => navigation.navigate(CURRENT_PROJECT_DETAILS,
                                { projectId: item?.id })
                        }
                    />
                )) : (
                    <ProfileStatusCard
                        title={NO_CURRENT_PROJECT_TITLE}
                        description={NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                        showIcon={false}
                    />
                )
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    card: {
        marginHorizontal: WRAPPER_MARGIN,
        marginVertical: SPACE_LARGE,
    },
    statusCard: {
        marginTop: WRAPPER_MARGIN,
        marginBottom: SPACE_LARGE,
    },
});
export default OffersScreen;
