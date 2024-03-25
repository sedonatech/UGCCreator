import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
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

    const renderItem = ({ item }) => (
        <TemplateBox
            borderRadius={wp(16)}
            backgroundColor={LIGHT_PURPLE}
            pAll={wp(16)}
            onPress={() => navigation.navigate(WEBVIEW, { url: item?.link })}
            style={styles.card}
            width={WRAPPED_SCREEN_WIDTH}
            height={wp(110)}
            mb={wp(16)}
            center
            selfCenter
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
    );

    const [limit, setLimit] = useState(6);

    useEffect(() => {
        setLimit(6);
    }, [selectedTab]);

    return (
        <TemplateBox flex backgroundColor={WHITE}>
            <FlatList
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                ListHeaderComponent={(
                    <TemplateBox backgroundColor={WHITE}>
                        <TemplateText
                            size={18}
                            startCase
                            bold
                            center
                            alignSelf="center"
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
                        <TemplateBox />
                    </TemplateBox>

                )}
                stickyHeaderIndices={[0]}
                data={brandsData?.slice(0, limit)}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item?.name}-${index}`}
                initialNumToRender={6}
                onEndReachedThreshold={0}
                onEndReached={() => { setLimit((prevLimit) => prevLimit + 4); }}
            />
        </TemplateBox>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        marginTop: HEADER_MARGIN,
    },
    contentContainer: {
        flexGrow: 1,
    },
});
export default AffiliateBrandsScreen;
