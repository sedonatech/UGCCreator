import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import { BLACK, BLACK_OVERLAY_30, IOS_GREEN, IOS_GREEN_85, RED, RED_85, WHITE, WHITE_85 } from '../../../theme/Colors';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../consts/content/Portfolio';
import { wp } from '../../../Utils/getResponsiveSize';
import useTranslation from '../../../hooks/useTranslation';

const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const CARD_WIDTH = SCREEN_WIDTH - WRAPPER_MARGIN * 2;

const SwipeCard = ({ name, imageUrl, shortDescription, location, categories, onSwipeRight, onSwipeLeft, isFirst }) => {
    const { t } = useTranslation();
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate(event => {
            if (!isFirst) return;
            translateX.value = event.translationX;
            translateY.value = event.translationY * 0.3;
        })
        .onEnd(event => {
            if (!isFirst) return;

            if (event.translationX > SWIPE_THRESHOLD) {
                translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                    runOnJS(onSwipeRight)();
                });
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                    runOnJS(onSwipeLeft)();
                });
            } else {
                translateX.value = withSpring(0, { damping: 15 });
                translateY.value = withSpring(0, { damping: 15 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            [-12, 0, 12],
            Extrapolation.CLAMP,
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
                { scale: isFirst ? 1 : 0.95 },
            ],
        };
    });

    const likeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
    }));

    const nopeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.card, animatedStyle, !isFirst && styles.cardBehind]}>
                <FastImage
                    source={{ uri: imageUrl || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.cover}
                />

                {/* Swipe label overlays */}
                <Animated.View style={[styles.labelContainer, styles.likeLabel, likeOpacity]}>
                    <TemplateText size={28} bold color={WHITE}>
                        {t('creatorExplore.creators.swipe.viewProfile') || 'View Profile'}
                    </TemplateText>
                </Animated.View>
                <Animated.View style={[styles.labelContainer, styles.nopeLabel, nopeOpacity]}>
                    <TemplateText size={28} bold color={WHITE}>
                        {t('creatorExplore.creators.swipe.skip') || 'Skip'}
                    </TemplateText>
                </Animated.View>

                {/* Info overlay at bottom */}
                <View style={styles.infoOverlay}>
                    <View style={styles.infoContent}>
                        <TemplateText size={22} bold color={WHITE} numberOfLines={1}>
                            {name}
                        </TemplateText>
                        {!!location && (
                            <View style={styles.locationRow}>
                                <TemplateIcon name="location-outline" color={WHITE} size={15} />
                                <TemplateText size={13} color={WHITE} ml={4}>
                                    {location}
                                </TemplateText>
                            </View>
                        )}
                        {!!shortDescription && (
                            <TemplateText size={13} color={WHITE_85} mt={6} numberOfLines={2}>
                                {shortDescription}
                            </TemplateText>
                        )}
                        {categories?.length > 0 && (
                            <View style={styles.categoriesRow}>
                                {categories.slice(0, 3).map(cat => (
                                    <View key={cat} style={styles.categoryPill}>
                                        <TemplateText size={10} color={BLACK} semiBold>
                                            {cat}
                                        </TemplateText>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

SwipeCard.propTypes = {
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    shortDescription: PropTypes.string,
    location: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    onSwipeRight: PropTypes.func,
    onSwipeLeft: PropTypes.func,
    isFirst: PropTypes.bool,
};

SwipeCard.defaultProps = {
    name: '',
    imageUrl: '',
    shortDescription: '',
    location: '',
    categories: [],
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
    isFirst: false,
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        borderRadius: wp(20),
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: WRAPPER_MARGIN,
        backgroundColor: WHITE,
        elevation: 5,
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    cardBehind: {
        top: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        backgroundColor: BLACK_OVERLAY_30,
    },
    infoContent: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    categoryPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: WHITE_85,
        marginRight: 6,
        marginBottom: 4,
    },
    labelContainer: {
        position: 'absolute',
        top: 30,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 3,
    },
    likeLabel: {
        left: 16,
        borderColor: IOS_GREEN,
        backgroundColor: IOS_GREEN_85,
    },
    nopeLabel: {
        right: 16,
        borderColor: RED,
        backgroundColor: RED_85,
    },
});

export default SwipeCard;
