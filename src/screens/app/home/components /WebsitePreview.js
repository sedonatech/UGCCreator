import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import {
    CATEGORY_BG_GREEN,
    CATEGORY_BG_PINK,
    CATEGORY_BG_PURPLE,
    CATEGORY_BG_BLUE,
    CATEGORY_BG_ORANGE,
    CATEGORY_BG_YELLOW,
    CATEGORY_BG_LAVENDER,
    CATEGORY_BG_DEFAULT,
    TEXT_SECONDARY,
    TEXT_TERTIARY,
} from '../../../../theme/Colors';

const getWebsitePreviewUrl = url => `https://image.thum.io/get/width/400/${url}`;

const CATEGORY_STYLES = {
    Skincare: { emoji: '🧴', bg: CATEGORY_BG_GREEN },
    Makeup: { emoji: '💄', bg: CATEGORY_BG_PINK },
    'Vegan Makeup': { emoji: '🌿💄', bg: CATEGORY_BG_GREEN },
    Haircare: { emoji: '💇‍♀️', bg: CATEGORY_BG_PURPLE },
    'Vegan Haircare': { emoji: '🌱💇‍♀️', bg: CATEGORY_BG_GREEN },
    Fashion: { emoji: '👗', bg: CATEGORY_BG_BLUE },
    'Vegan Fashion': { emoji: '🌿👜', bg: CATEGORY_BG_GREEN },
    Bodycare: { emoji: '🛁', bg: CATEGORY_BG_ORANGE },
    Fragrance: { emoji: '🌸', bg: CATEGORY_BG_PURPLE },
    Jewelry: { emoji: '💎', bg: CATEGORY_BG_YELLOW },
    'Food & Drink': { emoji: '🥤', bg: CATEGORY_BG_ORANGE },
    Health: { emoji: '💪', bg: CATEGORY_BG_GREEN },
    Lifestyle: { emoji: '✨', bg: CATEGORY_BG_PURPLE },
    'Vegan Skincare': { emoji: '🌱🧴', bg: CATEGORY_BG_GREEN },
    'Paid Package Reviews': { emoji: '📦', bg: CATEGORY_BG_LAVENDER },
};

const DEFAULT_STYLE = { emoji: '🌐', bg: CATEGORY_BG_DEFAULT };

/**
 * Preload website preview images so they're cached before display.
 * Call this with an array of brand URLs.
 */
export const preloadWebsitePreviews = urls => {
    const sources = urls.filter(Boolean).map(url => ({ uri: getWebsitePreviewUrl(url) }));
    FastImage.preload(sources);
};

const WebsitePreview = ({ url, category, brandName, height = 120 }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const categoryStyle = CATEGORY_STYLES[category] || DEFAULT_STYLE;
    const showSpinner = url && !loaded && !error;

    return (
        <TemplateBox
            borderRadius={10}
            overflow="hidden"
            height={height}
            backgroundColor={categoryStyle.bg}
            alignItems="center"
            justifyContent="center"
        >
            {/* Fallback shown when no URL or image failed */}
            {(!url || error) && (
                <>
                    <TemplateText size={36} mb={6}>
                        {categoryStyle.emoji}
                    </TemplateText>
                    <TemplateText size={14} semiBold color={TEXT_SECONDARY} numberOfLines={1}>
                        {brandName}
                    </TemplateText>
                    <TemplateText size={11} color={TEXT_TERTIARY} mt={2}>
                        {category}
                    </TemplateText>
                </>
            )}

            {/* Spinner while image is loading */}
            {showSpinner && <ActivityIndicator size="small" color={TEXT_TERTIARY} />}

            {/* Image overlays on top when loaded */}
            {url && !error && (
                <TemplateBox absolute top={0} left={0} right={0} bottom={0}>
                    <FastImage
                        source={{
                            uri: getWebsitePreviewUrl(url),
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        style={[styles.image, !loaded && styles.hidden]}
                        onLoad={() => setLoaded(true)}
                        onError={() => setError(true)}
                    />
                </TemplateBox>
            )}
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
    hidden: {
        opacity: 0,
    },
});

WebsitePreview.propTypes = {
    url: PropTypes.string,
    category: PropTypes.string,
    brandName: PropTypes.string,
    height: PropTypes.number,
};

WebsitePreview.defaultProps = {
    url: '',
    category: '',
    brandName: '',
    height: 120,
};

export default WebsitePreview;
