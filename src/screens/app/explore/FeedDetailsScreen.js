import React, {
    useLayoutEffect, useMemo, useState, useRef,
} from 'react';
import {
    Animated,
    ScrollView, StyleSheet, View,
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

const FeedDetailsScreen = ({ route, navigation }) => {
    const selectedFeed = route.params?.selectedFeed;

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
                    source={{ uri: selectedFeed?.thumbnail }}
                    width="100%"
                    style={styles.image}
                />

            </TemplateBox>

            <TemplateBox
                mh={WRAPPER_MARGIN}
                mt={WRAPPER_MARGIN}

            >
                <TemplateText
                    size={18}
                    bold
                >
                    {selectedFeed?.title}
                </TemplateText>
                <TemplateBox height={20} />
                <TemplateText
                    size={16}
                >
                    {selectedFeed?.description}
                </TemplateText>
                <TemplateBox height={20} />

                {
                    selectedFeed?.data?.length > 0 && selectedFeed?.data?.map((item, index) => (
                        <View key={`${item}-${index}`}>
                            <TemplateText size={14}>
                                {
                                    `${index + 1}. ${item}`
                                }
                            </TemplateText>
                            <TemplateBox height={20} />
                        </View>
                    ))
                }
            </TemplateBox>

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
export default FeedDetailsScreen;
