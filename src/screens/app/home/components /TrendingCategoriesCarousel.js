import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
    CATEGORY_CARD_WIDTH,
    SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import CardCarousel from '../../../../components/carousels/CardCarousel';
import { TRENDING_CATEGORIES } from '../../../../consts/content/Home';
import CategoryCard from '../../../../components/cards/CategoryCard';
import { BLUE } from '../../../../theme/Colors';

const TrendingCategoriesCarousel = () => (
    <View>
        <View style={styles.titleContainer}>
            <TemplateText size={22}>Trending Categories</TemplateText>
            <TemplateTouchable>
                <TemplateText startCase size={16} underLine color={BLUE}>
                    See All
                </TemplateText>
            </TemplateTouchable>
        </View>

        <CardCarousel
            cardMargin={WRAPPER_MARGIN}
            smallCardWidth={CATEGORY_CARD_WIDTH}
            style={styles.cardCarousel}
        >
            {TRENDING_CATEGORIES.map((item) => (
                <CategoryCard
                    key={item?.id}
                    onPress={() => {}}
                    icon={item?.icon}
                    title={item?.title}
                    proposalCount={`(${item?.proposals})`}
                    style={styles.card}
                />
            ))}
        </CardCarousel>
    </View>
);

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: WRAPPER_MARGIN,
        marginVertical: WRAPPER_MARGIN,
    },
    cardCarousel: {
        width: SCREEN_WIDTH,
        paddingLeft: WRAPPER_MARGIN,
        paddingVertical: 10,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
    },
});
export default TrendingCategoriesCarousel;
