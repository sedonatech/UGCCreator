import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { BRANDS } from '../../../../consts/content/Home';
import { BLACK_50, BLUE } from '../../../../theme/Colors';
import BrandsCard from './BrandsCard';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { BRAND_DETAILS, EXPLORE, EXPLORE_STACK } from '../../../../navigation/ScreenNames';
import { BRANDS_TAB } from '../../explore/ExploreScreen';

const BrandsCarousel = ({ style }) => {
    const navigation = useNavigation();
    return (
        <TemplateBox style={style}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={20}>
                <TemplateText size={18} bold>Top Brands </TemplateText>
                <TemplateBox flex />
                <TemplateTouchable
                    onPress={() => navigation.navigate(EXPLORE_STACK, {
                        screen: EXPLORE,
                        params: {
                            initialTab: BRANDS_TAB,
                        },
                    })}
                >
                    <TemplateText startCase size={14} underLine color={BLUE}>
                        See All
                    </TemplateText>
                </TemplateTouchable>
            </TemplateBox>
            <TemplateText size={14} color={BLACK_50} style={styles.subtitle}>
                Check out our top brands
            </TemplateText>

            <TemplateCarousel
                data={BRANDS}
                renderItem={({ item }) => (
                    <BrandsCard
                        image={item?.image}
                        title={item?.name}
                        shortDescription={item?.shortDescription}
                        style={styles.card}
                        onPress={() => navigation.navigate(BRAND_DETAILS, { brandId: item?.id })}
                    />
                )}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={SCREEN_WIDTH / 1.6}
            />
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    subtitle: {
        marginLeft: WRAPPER_MARGIN,
        marginBottom: 10,
    },
});

BrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

BrandsCarousel.defaultProps = {
    style: {},
};
export default BrandsCarousel;
