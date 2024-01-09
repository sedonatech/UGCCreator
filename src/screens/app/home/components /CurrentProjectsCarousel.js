import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import differenceInDays from 'date-fns/differenceInDays';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { CURRENT_PROJECTS_CAROUSEL } from '../../../../consts/content/Home';
import { BLUE } from '../../../../theme/Colors';
import CurrentProjectCard from './CurrentProjectCard';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import {
    CURRENT_PROJECT_DETAILS,
    OFFERS, OFFERS_STACK,
} from '../../../../navigation/ScreenNames';
import { projectStatuses } from '../../../../consts/AppFilters/ProjectStatus';
import useGetBrands from '../../../../hooks/creators/useGetBrands';
import useAuthContext from '../../../../hooks/auth/useAuthContext';

const CurrentProjectsCarousel = ({ style, isBrand, data }) => {
    const navigation = useNavigation();

    const { brands } = useGetBrands();

    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const cardsData = useMemo(() => {
        if (!data) return [];
        return data?.map((item) => {
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
                daysLeft: differenceInDays(new Date(item?.endDate), new Date()),
                currentStatus: application?.status?.filter(({ status }) => status === 'active')[0]?.name,
            };
        });
    }, [data]);

    return (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateText bold size={18}>
                    Your Active Projects
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
                data={cardsData}
                renderItem={({ item }) => (
                    <CurrentProjectCard
                        title={item?.title}
                        brand={item?.brand}
                        price={item?.price}
                        status={item?.status}
                        notificationCount={item?.notifications}
                        documentCount={item?.documents}
                        daysLeft={item?.daysLeft}
                        progress={item?.progress}
                        onPress={() => navigation.navigate(OFFERS_STACK, {
                            screen: CURRENT_PROJECT_DETAILS,
                            params: {
                                projectId: item?.id,
                            },
                        })}
                        style={styles.card}
                        isBrand={isBrand}
                    />
                )}
                snapToInterval={SCREEN_WIDTH / 1.23}
                showPagination
                paginationSize={CURRENT_PROJECTS_CAROUSEL?.length}
                contentContainerStyle={styles.cardCarousel}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: WRAPPER_MARGIN,
        marginTop: WRAPPER_MARGIN,
        marginBottom: 16,
    },
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
        marginVertical: 12,
    },
});

CurrentProjectsCarousel.propTypes = {
    style: PropTypes.shape({}),
    isBrand: PropTypes.bool,
};

CurrentProjectsCarousel.defaultProps = {
    style: {},
    isBrand: false,
};
export default CurrentProjectsCarousel;
