import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN, IS_ANDROID, SCREEN_HEIGHT, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import { TRANSPARENT, WHITE } from '../../../theme/Colors';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import TemplateBox from '../../../components/TemplateBox';
import ToggleCarousel from '../../../components/ToggleCarousel';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import RecommendedBrandModal from '../../../components/modals/RecommendedBrandModal';
import openUrl from '../../../Utils/openUrl';
import useWebview from '../../../hooks/webview/useWebview';

const RecommendedBrandsScreen = ({ route }) => {
    const selectedCategory = route?.params?.selectedCategory;

    const { recommendedBrands } = useFeatureFlags();

    const recommendedBrandsCategories = recommendedBrands?.recommendation;

    const brandCategories = useMemo(() => {
        if (!recommendedBrandsCategories) {
            return [];
        }
        return recommendedBrandsCategories?.map((brand) => ({
            name: brand?.name,
            value: brand?.value,
        }));
    }, [recommendedBrandsCategories]);

    const [selectedTab, setSelectedTab] = useState(brandCategories?.[0]);

    useEffect(() => {
        if (selectedCategory) {
            const selectedCategoryIndex = brandCategories?.findIndex(
                (category) => category?.value === selectedCategory,
            );
            setSelectedTab(brandCategories?.[selectedCategoryIndex]);
        }
    }, [selectedCategory, brandCategories]);

    const brandData = useMemo(() => {
        if (!selectedTab) {
            return [];
        }
        return recommendedBrandsCategories?.find((brand) => brand?.value
            === selectedTab?.value)?.data;
    }, [selectedTab, recommendedBrandsCategories]);

    const [selectedBrand, setSelectedBrand] = useState();

    const [modalVisible, setModalVisible] = useState(false);

    const { openLink } = useWebview();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox
                mt={HEADER_MARGIN}
                mh={WRAPPER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    bold
                    startCase
                    center
                >
                    Weekly Brands based on your Portfolio and powered by AI
                </TemplateText>
            </TemplateBox>
            <TemplateBox selfCenter flex>
                <ToggleCarousel
                    data={brandCategories}
                    selectedTab={selectedTab}
                    onChange={setSelectedTab}
                />
            </TemplateBox>
            <TemplateBox mh={WRAPPER_MARGIN} flex>
                {
                    brandData?.map((brand, index) => (
                        <ProfileStatusCard
                            key={brand?.id}
                            title={brand?.name}
                            description={brand?.description}
                            showProgress={false}
                            style={styles.statusCard}
                            slideInDelay={(index + 1) * 100}
                            descriptionLines={3}
                            onPress={() => {
                                setSelectedBrand(brand);
                                setTimeout(() => {
                                    setModalVisible(true);
                                }, 100);
                            }}
                        />
                    ))
                }
            </TemplateBox>
            <RecommendedBrandModal
                visible={modalVisible}
                title={selectedBrand?.name}
                subtitle={selectedBrand?.description}
                buttonTitle="View Brand Site"
                secondaryButtonTitle="Reach Out to Brand"
                onClose={() => {
                    setModalVisible(false);
                }}
                closeOnPress={() => {
                    openLink(selectedBrand?.url);
                    setModalVisible(false);
                }}
                onSecondaryButtonPress={() => {
                    Alert.alert('Available Only in Live App',
                        'This feature will be available when the app is live! Brands will receive an invitation to collaborate with you', [
                            {
                                text: 'OK',
                                onPress: () => {
                                    setModalVisible(false);
                                },
                            },
                        ]);
                }}
            />
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
    statusCard: {
        height: SCREEN_HEIGHT * 0.16,
        marginBottom: 20,
    },
});
export default RecommendedBrandsScreen;
