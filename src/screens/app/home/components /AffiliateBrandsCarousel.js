import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import {
    BLACK, IOS_BLUE, LIGHT_PURPLE, WHITE,
} from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { AFFILIATE_BRANDS, WEBVIEW } from '../../../../navigation/ScreenNames';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../../Utils/getResponsiveSize';
import {
    ELEVATION,
    SHADOW_OFFSET_HEIGHT,
    SHADOW_OFFSET_WIDTH,
} from '../../../../theme/Shadow';

const AffiliateBrandsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const { affiliate } = useFeatureFlags();

    const affiliateBrands = affiliate?.brands;

    // get the first four brands to display with a useMemo

    const firstFourBrands = useMemo(() => {
        if (!affiliateBrands) return [];

        return affiliateBrands.slice(0, 4);
    }, [affiliateBrands]);

    return (
        <TemplateBox style={style}>
            {affiliateBrands && (
                <TemplateBox>
                    <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={16}>
                        <TemplateBox width={SCREEN_WIDTH * 0.8}>
                            <TemplateText
                                size={16}
                                semiBold
                            >
                                Brand ambassador, influencer and affiliate programs
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox flex />
                        <TemplateTouchable
                            onPress={() => navigation.navigate(AFFILIATE_BRANDS)}
                        >
                            <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                                See All
                            </TemplateText>
                        </TemplateTouchable>
                    </TemplateBox>

                    <TemplateText
                        size={13}
                        color={BLACK}
                        style={styles.subtitle}
                    >
                        Empower your UGC career and unlock new opportunities for growth
                        with our Brand Ambassador, Influencer, and Affiliate Programs Hub.
                    </TemplateText>
                </TemplateBox>
            )}
            <TemplateCarousel
                data={firstFourBrands}
                renderItem={({ item }) => (
                    <TemplateBox
                        borderRadius={wp(16)}
                        backgroundColor={LIGHT_PURPLE}
                        pAll={wp(16)}
                        onPress={() => navigation.navigate(WEBVIEW, { url: item?.link })}
                        style={styles.card}
                        width={SCREEN_WIDTH / 1.6}
                        height={wp(110)}
                        center
                        mr={wp(16)}
                        mt={wp(8)}
                    >
                        <TemplateText
                            startCase
                            size={wp(16)}
                            semiBold
                        >
                            {item?.name}
                        </TemplateText>
                        <TemplateBox height={wp(8)} />
                        <TemplateText
                            size={wp(12)}

                        >
                            Dive into descriptions, insights with just a tap.
                        </TemplateText>
                    </TemplateBox>
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
    subtitle: {
        marginLeft: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    card: {
        shadowOffset: {
            width: SHADOW_OFFSET_WIDTH,
            height: SHADOW_OFFSET_HEIGHT,
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: ELEVATION,
    },
});

AffiliateBrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

AffiliateBrandsCarousel.defaultProps = {
    style: {},
};
export default AffiliateBrandsCarousel;
