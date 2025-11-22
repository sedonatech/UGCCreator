import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { BLACK, BLACK_20, IOS_BLUE, WHITE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { AFFILIATE_BRANDS, WEBVIEW } from '../../../../navigation/ScreenNames';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../../Utils/getResponsiveSize';
import Button from '../../../../components/Button';

const AffiliateBrandsCarousel = ({ style }) => {
    const navigation = useNavigation();
    const { affiliate } = useFeatureFlags();
    const affiliateBrands = affiliate?.brands;
    // get four random brands to display with a useMemo
    const randomFourBrands = useMemo(() => {
        if (!affiliateBrands) return [];
        if (affiliateBrands.length <= 4) return affiliateBrands;
        const shuffled = [...affiliateBrands].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [affiliateBrands]);

    return (
        <TemplateBox style={style}>
            {affiliateBrands && (
                <TemplateBox>
                    <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={10}>
                        <TemplateBox width={SCREEN_WIDTH * 0.8}>
                            <TemplateText size={16} semiBold>
                                Brand Collabs
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox flex />
                        <TemplateTouchable
                            onPress={() =>
                                navigation.navigate(AFFILIATE_BRANDS, {
                                    title: 'Brand Collabs',
                                    subtitle: 'Explore our brand collaborations',
                                })
                            }
                        >
                            <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                                See All
                            </TemplateText>
                        </TemplateTouchable>
                    </TemplateBox>
                    <TemplateBox mh={WRAPPER_MARGIN} mb={16}>
                        <TemplateText size={13} color={BLACK}>
                            Discover brand collabs, ambassador deals, and affiliate programs matched to your niche.
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            )}
            <TemplateCarousel
                data={randomFourBrands}
                renderItem={({ item }) => (
                    <TemplateBox
                        borderRadius={wp(16)}
                        pAll={wp(16)}
                        onPress={() => navigation.navigate(WEBVIEW, { url: item?.link })}
                        style={styles.card}
                        width={SCREEN_WIDTH / 1.6}
                        // height={wp(120)}
                        center
                        mr={wp(16)}
                    >
                        <TemplateText startCase size={wp(16)} semiBold>
                            {item?.name}
                        </TemplateText>

                        <TemplateText size={wp(13)} numberOfLines={2} mv={10}>
                            {item?.description}
                        </TemplateText>
                        <Button
                            title="Apply Now"
                            onPress={() => navigation.navigate(WEBVIEW, { url: item?.link })}
                            style={styles.button}
                            titleSize={12}
                        />
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
    card: {
        backgroundColor: WHITE,
        borderColor: BLACK_20,
        borderWidth: 1.2,
        shadowColor: BLACK,
    },
    button: {
        marginVertical: 10,
        height: 40,
        width: 150,
        borderRadius: 16,
        alignSelf: 'center',
    },
});

AffiliateBrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

AffiliateBrandsCarousel.defaultProps = {
    style: {},
};
export default AffiliateBrandsCarousel;
