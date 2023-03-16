import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { CURRENT_PROJECTS_CAROUSEL } from '../../../../consts/content/Home';
import { BLUE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import {
    BRAND_OFFERS,
} from '../../../../navigation/ScreenNames';
import CurrentProjectCard from '../../../app/home/components /CurrentProjectCard';

const ActiveProjectsCarousel = ({ style, projectsCarouselData }) => {
    const navigation = useNavigation();

    return (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateText bold size={18}>
                    Your Active Projects
                    {' '}
                </TemplateText>
                <TemplateTouchable
                    onPress={() => navigation.navigate(BRAND_OFFERS)}
                >
                    <TemplateText startCase size={14} underLine color={BLUE}>
                        See All
                    </TemplateText>
                </TemplateTouchable>
            </View>

            <TemplateCarousel
                data={projectsCarouselData}
                renderItem={({ item }) => (
                    <CurrentProjectCard
                        title={item?.title}
                        brand={item?.brand}
                        price={item?.price}
                        status={item?.status}
                        notificationCount={item?.notifications}
                        documentCount={item?.documents}
                        daysLeft={item?.daysLeft}
                        onPress={item?.onPress}
                        style={styles.card}
                        projectId={item?.id ? item?.id : ''}
                        isBrand
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
        marginVertical: WRAPPER_MARGIN,
    },
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
        marginBottom: 10,
    },
});

ActiveProjectsCarousel.propTypes = {
    style: PropTypes.shape({}),
    projectsCarouselData: PropTypes.arrayOf(PropTypes.shape({})),
};

ActiveProjectsCarousel.defaultProps = {
    style: {},
    projectsCarouselData: [],
};
export default ActiveProjectsCarousel;
