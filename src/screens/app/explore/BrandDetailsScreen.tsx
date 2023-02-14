import React, {
    FC, useLayoutEffect, useMemo, useState
} from 'react';
import {
    ScrollView, StyleSheet,
} from 'react-native';

import {
    BLACK_30,
    WHITE, WHITE_40
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import { BRANDS, PROJECTS } from '../../../consts/content/Home';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ToggleCarousel from '../../../components/ToggleCarousel';
import DescriptionTab from './components/DescriptionTab';
import ProjectsTab from './components/ProjectsTab';

const BRAND_DETAILS_TABS = [
    {
        name: 'About',
        value: 'about'
    },
    {
        name: 'Open Projects',
        value: 'projects'
    }
];
interface BrandDetailsScreenProps {
    route: any;
    navigation: any;
}
const BrandDetailsScreen:FC<BrandDetailsScreenProps> = ({ route, navigation }) => {
    const brandId = route?.params?.brandId;

    const [selectedTab, setSelectedTab] = useState(BRAND_DETAILS_TABS[0]);

    const selectedBrand = useMemo(() => {
        if (!BRANDS) return null;

        return BRANDS?.find(({ id }) => id === brandId);
    }, [brandId, BRANDS]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={WHITE_40}
                    ml={WRAPPER_MARGIN}
                />
            )
        });
    }, [navigation]);

    if (!selectedBrand) return <LoadingOverlay message="Fetching brand details..." />;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TemplateBox
                fullGradient
                height={SCREEN_HEIGHT / 2.4}
                gradientColors={[BLACK_30, BLACK_30]}
            >
                {/* @ts-ignore */}
                <BackgroundImage
                    source={selectedBrand?.image}
                    width="100%"
                    style={styles.image}
                />
                <TemplateBox
                    absolute
                    top={(SCREEN_HEIGHT / 3.4)}
                    left={20}
                >
                    <TemplateText
                        bold
                        size={24}
                        color={WHITE}
                    >
                        {selectedBrand?.name}
                    </TemplateText>
                    <TemplateBox height={10} />
                    <TemplateText
                        size={16}
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
                    profileUrl={selectedBrand?.url}
                    phone={selectedBrand?.phone}
                    email={selectedBrand?.email}
                    address={selectedBrand?.address}
                    instagram={selectedBrand?.instagram}
                    facebook={selectedBrand?.facebook}
                    twitter={selectedBrand?.twitter}
                    tiktok={selectedBrand?.tiktok}
                    linkedin={selectedBrand?.linkedin}
                />
            )}
            {selectedTab?.value === BRAND_DETAILS_TABS[1]?.value && (
                <ProjectsTab data={PROJECTS} />
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
    }

});
export default BrandDetailsScreen;
