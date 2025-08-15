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
import { BRAND_DEALS_SCREEN, WEBVIEW } from '../../../../navigation/ScreenNames';
import { wp } from '../../../../Utils/getResponsiveSize';
import {
    ELEVATION,
    SHADOW_OFFSET_HEIGHT,
    SHADOW_OFFSET_WIDTH,
} from '../../../../theme/Shadow';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';

interface BrandDealsCarouselProps {
    style?: object;
}

type RootStackParamList = {
    [BRAND_DEALS_SCREEN]: undefined;
    [WEBVIEW]: { url: string };
};

const BrandDealsCarousel = ({ style }: BrandDealsCarouselProps): JSX.Element => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    //@ts-ignore
    const { ugcGigs } = useFeatureFlags();
    const gigs = ugcGigs?.gigs;
    // get the first four brands to display with a useMemo
    const firstSixGigs = useMemo(() => {
        if (!gigs) return [];

        return gigs.slice(0, 6);
    }, [gigs]);

    return (
        <TemplateBox style={style}>
            {firstSixGigs && (
                <TemplateBox>
                    <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={16}>
                        <TemplateBox width={SCREEN_WIDTH * 0.8}>
                            <TemplateText
                                size={16}
                                semiBold
                            >
                             {gigs?.title || "Fresh Creator Gigs"}
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
                       {gigs?.subtitle || "High-intent teams investing in creator content right now"}
                    </TemplateText>
                </TemplateBox>
            )}
            <TemplateCarousel
                data={firstSixGigs}
                renderItem={({ item }) => (
                    <TemplateBox
                        borderRadius={wp(16)}
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
                            {item?.title }
                        </TemplateText>
                        <TemplateBox height={wp(8)} />
                        <TemplateText
                            size={wp(12)}

                        >
                            {item?.company}--{item?.source}
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
