import React, {
    useLayoutEffect, useRef,
} from 'react';
import {
    Animated,
    ScrollView, StyleSheet, View,
} from 'react-native';

import Pdf from 'react-native-pdf';
import {
    DEFAULT_GRADIENT,
    WHITE, WHITE_40,
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    WRAPPER_MARGIN,
    SCREEN_WIDTH,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import HeaderIconButton from '../../../components/header/HeaderButton';
import { wp } from '../../../Utils/getResponsiveSize';

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

    return (selectedFeed?.pdf && !!selectedFeed?.data?.url) ? (
        <Pdf
            source={{ uri: selectedFeed?.data?.url }}
            style={styles.pdf}
        />
    ) : (
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
                gradientColors={DEFAULT_GRADIENT}
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
                    width={SCREEN_WIDTH}
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
                    (!selectedFeed?.pdf && selectedFeed?.data?.length > 0) && selectedFeed?.data?.map((item, index) => (
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
    pdf: {
        flex: 1,
        width: wp(SCREEN_WIDTH),
    },
});
export default FeedDetailsScreen;
