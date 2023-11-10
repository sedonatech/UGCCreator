import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';

import { BLACK, IOS_BLUE } from '../../../../theme/Colors';
import BrandsCard from './BrandsCard';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { BRAND_DETAILS, EXPLORE, EXPLORE_STACK } from '../../../../navigation/ScreenNames';
import { BRANDS_TAB } from '../../explore/ExploreScreen';
import useGetBrands from '../../../../hooks/creators/useGetBrands';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../../consts/content/Portfolio';

const BrandsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const { brands } = useGetBrands();

    const brandsData = useMemo(() => {
        if (!brands) {
            return [];
        }
        return brands.map((brand) => ({
            id: brand?.id,
            name: brand?.name,
            image: brand?.image,
            shortDescription: brand?.shortDescription
        }));
    }, [brands]);

    return (
        <TemplateBox style={style}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={20}>
                <TemplateText size={18} bold>Brands on our Platform</TemplateText>
                <TemplateBox flex />
                <TemplateTouchable
                    onPress={() => navigation.navigate(EXPLORE_STACK, {
                        screen: EXPLORE,
                        params: {
                            initialTab: BRANDS_TAB,
                        },
                    })}
                >
                    <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                        See All
                    </TemplateText>
                </TemplateTouchable>
            </TemplateBox>

            <TemplateText size={14} color={BLACK} style={styles.subtitle}>
                Check out the brands currently on our platform
            </TemplateText>
            <TemplateCarousel
                
                data={brandsData?.sort((a,b) => a?.name?.localeCompare(b?.name))}
                renderItem={({ item }) => (
                    <BrandsCard
                        image={{ uri: item?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
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
