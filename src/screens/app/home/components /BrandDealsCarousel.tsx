import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import {
    BLACK, IOS_BLUE, LIGHT_PURPLE,
} from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { AFFILIATE_BRANDS, BRAND_DEALS_SCREEN, WEBVIEW } from '../../../../navigation/ScreenNames';
import { wp } from '../../../../Utils/getResponsiveSize';
import {
    ELEVATION,
    SHADOW_OFFSET_HEIGHT,
    SHADOW_OFFSET_WIDTH,
} from '../../../../theme/Shadow';
import { userGeneratedContentBrandDealsSearch } from '../../../../hooks/content/useUserGeneratedContentBrandDealsSearch';
import isAndroid from '../../../subscriptions/utils/isAndroid';

interface BrandDealsCarouselProps {
    style?: object;
}

type RootStackParamList = {
    [BRAND_DEALS_SCREEN]: undefined;
    [WEBVIEW]: { url: string };
};

const BrandDealsCarousel = ({ style }: BrandDealsCarouselProps): JSX.Element => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const functionsBaseAddress = isAndroid
        ? 'http://10.0.2.2:5001/ugccreatorapp/us-central1'
        : 'http://localhost:5001/ugccreatorapp/us-central1';

     const {
            status: brandDealsStatus,
            leads: brandDealsLeads,
            error: brandDealsError,
            refresh: refreshBrandDeals,
            hasAnyResults: hasAnyBrandDealsResults,
        } = userGeneratedContentBrandDealsSearch({
            backendEndpoint: `${functionsBaseAddress}/userGeneratedContentBrandDealsSearch`,
            shouldFetchOnMount: true,
            requestTimeoutInMilliseconds: 15000,
        });

    // get the first four brands to display with a useMemo
    const firstTenBrands = useMemo(() => {
        if (!brandDealsLeads) return [];

        return brandDealsLeads.slice(0, 4);
    }, [brandDealsLeads]);

    return (
        <TemplateBox style={style}>
            {brandDealsLeads && (
                <TemplateBox>
                    <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={16}>
                        <TemplateBox width={SCREEN_WIDTH * 0.8}>
                            <TemplateText
                                size={16}
                                semiBold
                            >
                             High-Intent Brand Deals
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox flex />
                        <TemplateTouchable
                            onPress={() => navigation.navigate(BRAND_DEALS_SCREEN)}
                            activeOpacity={0.7}
                            disabled={false}
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
                       Social media, UGC and brand partnerships—handpicked for you.
                    </TemplateText>
                </TemplateBox>
            )}
            <TemplateCarousel
                data={firstTenBrands}
                renderItem={({ item }) => (
                    <TemplateBox
                        borderRadius={wp(16)}
                        pAll={wp(16)}
                        onPress={() => navigation.navigate(WEBVIEW, { url: item?.applicationLink })}
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
                            {item?.brandName }
                        </TemplateText>
                        <TemplateBox height={wp(8)} />
                        <TemplateText
                            size={wp(12)}

                        >
                            {item?.roleTitle}
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
        backgroundColor: LIGHT_PURPLE,
    },
});

BrandDealsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

BrandDealsCarousel.defaultProps = {
    style: {},
};


export default BrandDealsCarousel;
