import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
    HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH,
} from '../../../theme/Layout';
import {
    BLACK, LIGHT_PURPLE, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../Utils/getResponsiveSize';
import { WEBVIEW } from '../../../navigation/ScreenNames';
import ToggleCarousel from '../../../components/ToggleCarousel';
import removeDuplicatesFromAffiliateBrands from '../../../Utils/removeAffliliateCategoryDuplicates';
import Button from '../../../components/Button';

const AffiliateBrandsScreen = ({ navigation, route }) => {
    const { affiliate } = useFeatureFlags();
    const title = route?.params?.title;
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
            height={wp(140)}
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
                {item?.description}
            </TemplateText>
            <Button
                title="Learn More"
                onPress={() => navigation.navigate(WEBVIEW, { url: item?.link })}
                style={styles.button}
                titleSize={12}
            />
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
                            {title}
                        </TemplateText>
                        <TemplateText
                            size={13}
                            color={BLACK}
                            center
                            width={SCREEN_WIDTH / 1.1}
                            mt={8}
                        >
                            Discover brand collabs, ambassador deals, and affiliate programs
                            matched to your niche.
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
    card: {
        backgroundColor: WHITE,
        borderColor: LIGHT_PURPLE,
        borderWidth: 1.5,
    },
    button: {
        marginVertical: 10,
        height: 40,
        width: 180,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 20,
    },
});
export default AffiliateBrandsScreen;
