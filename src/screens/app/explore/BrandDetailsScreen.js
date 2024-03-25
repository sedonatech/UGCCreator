import React, {
    useLayoutEffect, useState,
} from 'react';
import {
    ScrollView, StyleSheet,
} from 'react-native';

import {
    DEFAULT_GRADIENT,
    WHITE, WHITE_40,
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ToggleCarousel from '../../../components/ToggleCarousel';
import DescriptionTab from './components/DescriptionTab';
import ProjectsTab from './components/ProjectsTab';
import useGetBrands from '../../../hooks/creators/useGetBrands';

const BRAND_DETAILS_TABS = [
    {
        name: 'About',
        value: 'about',
    },
    {
        name: 'Open Projects',
        value: 'projects',
    },
];

const BrandDetailsScreen = ({ route, navigation }) => {
    const brandId = route?.params?.brandId;

    const { selectedBrand } = useGetBrands(brandId);

    const [selectedTab, setSelectedTab] = useState(BRAND_DETAILS_TABS[0]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={WHITE_40}
                    ml={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

    if (!selectedBrand) return <LoadingOverlay message="Fetching brand details..." />;

    return (

        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox
                fullGradient
                height={SCREEN_HEIGHT / 2.4}
                gradientColors={DEFAULT_GRADIENT}
            >
                {/* @ts-ignore */}
                <BackgroundImage
                    source={{ uri: selectedBrand?.image }}
                    width={SCREEN_WIDTH}
                    style={styles.image}
                />
                <TemplateBox
                    absolute
                    top={(SCREEN_HEIGHT / 3.4)}
                    left={20}
                >
                    <TemplateText
                        bold
                        size={18}
                        color={WHITE}
                    >
                        {selectedBrand?.name}
                    </TemplateText>
                    <TemplateBox height={10} />
                    <TemplateText
                        size={14}
                        color={WHITE}
                    >
                        {selectedBrand?.shortDescription}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox selfCenter flex>
                <ToggleCarousel
                    data={BRAND_DETAILS_TABS}
                    selectedTab={selectedTab}
                    onChange={setSelectedTab}
                />
            </TemplateBox>

            {selectedTab?.value === BRAND_DETAILS_TABS[0]?.value && (
                <DescriptionTab
                    description={selectedBrand?.description}
                    name={selectedBrand?.name}
                    profileUrl={selectedBrand?.url}
                    phone={selectedBrand?.contact?.phone}
                    email={selectedBrand?.contact?.email}
                    address={selectedBrand?.contact?.address}
                    instagram={selectedBrand?.socialMedia?.instagram}
                    facebook={selectedBrand?.socialMedia?.facebook}
                    twitter={selectedBrand?.socialMedia?.twitter}
                    tiktok={selectedBrand?.socialMedia?.tiktok}
                    linkedin={selectedBrand?.socialMedia?.linkedin}
                    brandFCMToken={selectedBrand?.fcmToken}
                    brandId={selectedBrand?.id}
                />
            )}
            {selectedTab?.value === BRAND_DETAILS_TABS[1]?.value && (
                <ProjectsTab id={brandId} />
            )}

        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    image: {
        zIndex: -1,
    },
    contentContainer: {
        flexGrow: 1,
    },
});
export default BrandDetailsScreen;
