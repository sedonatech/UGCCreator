import React, { useMemo, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
    HEADER_MARGIN, IS_ANDROID, WRAPPED_SCREEN_WIDTH,
} from '../../../theme/Layout';
import { LIGHT_PURPLE, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../Utils/getResponsiveSize';
import { WEBVIEW } from '../../../navigation/ScreenNames';
import ToggleCarousel from '../../../components/ToggleCarousel';
import removeDuplicatesFromAffiliateBrands from '../../../Utils/removeAffliliateCategoryDuplicates';

const AffiliateBrandsScreen = ({ navigation }) => {
    const { affiliate } = useFeatureFlags();

    const affiliateBrands = affiliate?.brands;

    const allCategory = {
        name: 'All',
        value: 'all',
    };

    const brandCategories = useMemo(() => {
        if (!affiliateBrands) {
            return [];
        }
        const categories = affiliateBrands?.map(({ category }) => ({
            name: category,
            value: category,
        }));

        // add all category
        categories.unshift(allCategory);
        return removeDuplicatesFromAffiliateBrands(categories);
    }, [affiliateBrands]);

    const [selectedTab, setSelectedTab] = useState(brandCategories?.[0] ?? 'beauty');

    const brandsData = useMemo(() => {
        if (!affiliateBrands?.length) return [];
        if (selectedTab?.value === 'all') return affiliateBrands;

        return affiliateBrands?.filter(({ category }) => category === selectedTab?.value);
    }, [selectedTab, affiliateBrands]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
        >
            <TemplateBox
                mt={HEADER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    startCase
                    bold
                    center
                >
                    Brand ambassador, influencer and affiliate programs
                </TemplateText>
                <TemplateBox selfCenter flex>
                    <ToggleCarousel
                        data={brandCategories}
                        selectedTab={selectedTab}
                        onChange={setSelectedTab}
                    />
                </TemplateBox>
                <TemplateBox>
                    {!!brandsData?.length && brandsData?.map(({ name, link }, index) => (
                        <TemplateBox
                            borderRadius={wp(16)}
                            backgroundColor={LIGHT_PURPLE}
                            pAll={wp(16)}
                            onPress={() => navigation.navigate(WEBVIEW, { url: link })}
                            style={styles.card}
                            width={WRAPPED_SCREEN_WIDTH}
                            height={wp(110)}
                            mb={wp(16)}
                            center
                            key={`${name}-${index}`}
                        >
                            <TemplateText
                                startCase
                                size={wp(16)}
                                semiBold
                            >
                                {name}
                            </TemplateText>
                            <TemplateBox height={wp(8)} />
                            <TemplateText
                                size={wp(12)}
                            >
                                Dive into descriptions, insights with just a tap.
                            </TemplateText>
                        </TemplateBox>
                    ))}
                </TemplateBox>
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
});
export default AffiliateBrandsScreen;
