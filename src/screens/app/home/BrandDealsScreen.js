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

const BrandDealsScreen = ({ navigation }) => {
    const { ugcGigs } = useFeatureFlags();

    const gigs = ugcGigs?.gigs;

    const allCategory = {
        name: 'All',
        value: 'all',
    };

    const gigsCategories = useMemo(() => {
        if (!gigs) {
            return [];
        }
        const categories = gigs?.map(({ source }) => ({
            name: source,
            value: source,
        }));

        // add all category
        categories.unshift(allCategory);
        return removeDuplicatesFromAffiliateBrands(categories);
    }, [gigs]);

    const [selectedTab, setSelectedTab] = useState(gigsCategories?.[0] ?? 'beauty');

    const gigsFiltered = useMemo(() => {
        if (!gigs?.length) return [];
        if (selectedTab?.value === 'all') return gigs;

        return gigs?.filter(({ source }) => source === selectedTab?.value);
    }, [selectedTab, gigs]);

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
                {item?.title}
            </TemplateText>
            <TemplateBox height={wp(8)} />
            <TemplateText
                size={wp(12)}
            >
                {item?.company}
                -
                {item?.source}
            </TemplateText>
            <TemplateBox height={wp(4)} />
            <TemplateText
                size={wp(8)}
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
                            {ugcGigs?.subtitle || 'High-intent teams investing in creator content right now'}
                        </TemplateText>
                        <TemplateBox selfCenter flex>
                            <ToggleCarousel
                                data={gigsCategories}
                                selectedTab={selectedTab}
                                onChange={setSelectedTab}
                            />
                        </TemplateBox>
                        <TemplateBox />
                    </TemplateBox>

                )}
                stickyHeaderIndices={[0]}
                data={gigsFiltered?.slice(0, limit)}
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
export default BrandDealsScreen;
