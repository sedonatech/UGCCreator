import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Configuration, OpenAIApi } from "openai-edge"

import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';

import { BLACK, IOS_BLUE } from '../../../../theme/Colors';
import BrandsCard from './BrandsCard';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { RECOMMENDED_BRANDS } from '../../../../navigation/ScreenNames';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import useAuthContext from '../../../../hooks/auth/useAuthContext';

const RecommendedBrandsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const userSelectedCategories = useMemo(() => {
        if (!profile?.categories) {
            return [];
        }
        return profile?.categories;
    }, [profile]);

    const { recommendedBrands } = useFeatureFlags();

    const suggestions = async(brandType) => {
        const OPENAI_API_KEY = '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';

        // Create an OpenAI API client (that's edge friendly!)
        const configuration = new Configuration({
          apiKey: OPENAI_API_KEY,
        });
        
        const openai = new OpenAIApi(configuration);
    
        const completion = await openai.createChatCompletion({
            model: 'gpt-4',
            stream: false,
            temperature: 0.2,
            messages: [
            {
                role: "user",
                content: `I need 10 fitness ${brandType} brands with name and description as keys in a list of json objects.`
            },
            ],
        });
    
        const response = await completion.json();
        const result = JSON.parse(response?.choices[0]?.message?.content);
        return result;
    }

    suggestions("fitness and wellness")
    const recommendedBrandsCategories = recommendedBrands?.recommendation;

    const brandCategories = useMemo(() => {
        if (!recommendedBrandsCategories) {
            return [];
        }
        if (userSelectedCategories?.length) {
            return recommendedBrandsCategories
                ?.filter((brand) => userSelectedCategories?.includes(brand?.value))
                ?.map((brand) => ({
                    id: brand?.value,
                    category: brand?.value,
                    name: brand?.name,
                    image: brand?.imageUrl,
                }));
        }
        return recommendedBrandsCategories?.map((brand) => ({
            id: brand?.value,
            category: brand?.value,
            name: brand?.name,
            image: brand?.imageUrl,
        }));
    }, [recommendedBrandsCategories, userSelectedCategories]);

    const [selectedCategory, setSelectedCategory] = useState();

    useEffect(() => {
        if (brandCategories?.length) {
            setSelectedCategory(brandCategories[0]?.category);
        }
    }, [brandCategories]);

    return (
        <TemplateBox style={style}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={20}>
                <TemplateText size={18} bold>
                    Recommended Brands
                    {'\n'}
                    <TemplateText size={10} color={IOS_BLUE}>(powered by OpenAI)</TemplateText>
                </TemplateText>
                <TemplateBox flex />
                <TemplateTouchable
                    onPress={() => navigation.navigate(RECOMMENDED_BRANDS, { selectedCategory })}
                >
                    <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                        See All
                    </TemplateText>
                </TemplateTouchable>
            </TemplateBox>

            <TemplateText size={14} color={BLACK} style={styles.subtitle}>
                {/* eslint-disable-next-line max-len */}
                Check out our weekly AI recommended brands based on your preferences in your portfolio. These brands may not be on our platform yet, but you can request them to be added and collaborate with them.
            </TemplateText>
            <TemplateCarousel
                data={brandCategories}
                renderItem={({ item }) => (
                    <BrandsCard
                        image={{ uri: item?.image }}
                        title={item?.name}
                        shortDescription={item?.shortDescription}
                        style={styles.card}
                        onPress={() => {
                            setSelectedCategory(item?.category);
                            setTimeout(() => {
                                navigation.navigate(RECOMMENDED_BRANDS, {
                                    selectedCategory: item?.category,
                                });
                            }, 100);
                        }}
                        buttonTitle="View brands"
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

RecommendedBrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

RecommendedBrandsCarousel.defaultProps = {
    style: {},
};
export default RecommendedBrandsCarousel;
