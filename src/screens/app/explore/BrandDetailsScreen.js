import React, {
    useLayoutEffect, useMemo, useState, useRef,
} from 'react';
import {
    Animated,
    ScrollView, StyleSheet,
} from 'react-native';

import {
    BLACK_30,
    WHITE, WHITE_40,
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
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

    const { brands } = useGetBrands();

    const [selectedTab, setSelectedTab] = useState(BRAND_DETAILS_TABS[0]);

    const selectedBrand = useMemo(() => {
        if (!brands?.length) return null;

        return brands?.find(({ id }) => id === brandId);
    }, [brandId, brands]);

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

    const pan = useRef(new Animated.ValueXY()).current;

    if (!selectedBrand) return <LoadingOverlay message="Fetching brand details..." />;

    return (

        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: pan.y } } }],
                {
                    useNativeDriver: false,
                },
            )}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox
                animated
                fullGradient
                height={SCREEN_HEIGHT / 2.4}
                gradientColors={[BLACK_30, BLACK_30]}
                style={{
                    transform: [
                        {
                            translateY: pan.y.interpolate({
                                inputRange: [-1000, 0],
                                outputRange: [-200, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            scale: pan.y.interpolate({
                                inputRange: [-3000, 0],
                                outputRange: [20, 1],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                {/* @ts-ignore */}
                <BackgroundImage
                    source={{ uri: selectedBrand?.image }}
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
                        size={22}
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
                    profileUrl={selectedBrand?.url}
                    phone={selectedBrand?.contact?.phoneNumber}
                    email={selectedBrand?.email}
                    address={selectedBrand?.contact?.address}
                    instagram={selectedBrand?.socialMedia?.instagram}
                    facebook={selectedBrand?.socialMedia?.facebook}
                    twitter={selectedBrand?.socialMedia?.twitter}
                    tiktok={selectedBrand?.socialMedia?.tiktok}
                    linkedin={selectedBrand?.socialMedia?.linkedin}
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
