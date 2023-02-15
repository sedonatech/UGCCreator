import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
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

const CurrentProjectsCarousel = ({ style }) => {
    const navigation = useNavigation();

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
                data={CURRENT_PROJECTS_CAROUSEL}
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
                        })}
                        style={styles.card}
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

CurrentProjectsCarousel.propTypes = {
    style: PropTypes.object,
};

CurrentProjectsCarousel.defaultProps = {
    style: {},
};
export default CurrentProjectsCarousel;
