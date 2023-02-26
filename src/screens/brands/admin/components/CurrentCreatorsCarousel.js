import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { OFFERS, OFFERS_STACK } from '../../../../navigation/ScreenNames';
import { BLUE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';

import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import CurrentCreatorsCard from './CurrentCreatorsCard';
import useGetCreators from '../../../../hooks/brands/useGetCreators';

const CurrentCreatorsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const { filteredCreators } = useGetCreators();

    return (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateText bold size={18}>
                    Your Active Creators
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
                data={filteredCreators}
                renderItem={({ item }) => (
                    <CurrentCreatorsCard
                        name={item?.userName}
                        image={item?.image}
                        shortDescription={item?.shortDescription}
                        style={styles.card}
                    />
                )}
                snapToInterval={SCREEN_WIDTH / 1.3}
                showPagination
                paginationSize={filteredCreators?.length}
                contentContainerStyle={styles.cardCarousel}
            />
        </View>
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
});
export default CurrentCreatorsCarousel;
