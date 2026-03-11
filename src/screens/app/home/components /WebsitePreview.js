import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';

const getWebsitePreviewUrl = url => `https://image.thum.io/get/width/400/${url}`;

const CATEGORY_STYLES = {
    Skincare: { emoji: '🧴', bg: '#E8F5E9' },
    Makeup: { emoji: '💄', bg: '#FCE4EC' },
    'Vegan Makeup': { emoji: '🌿💄', bg: '#E8F5E9' },
    Haircare: { emoji: '💇‍♀️', bg: '#F3E5F5' },
    'Vegan Haircare': { emoji: '🌱💇‍♀️', bg: '#E8F5E9' },
    Fashion: { emoji: '👗', bg: '#E3F2FD' },
    'Vegan Fashion': { emoji: '🌿👜', bg: '#E8F5E9' },
    Bodycare: { emoji: '🛁', bg: '#FFF3E0' },
    Fragrance: { emoji: '🌸', bg: '#F3E5F5' },
    Jewelry: { emoji: '💎', bg: '#FFF8E1' },
    'Food & Drink': { emoji: '🥤', bg: '#FFF3E0' },
    Health: { emoji: '💪', bg: '#E8F5E9' },
    Lifestyle: { emoji: '✨', bg: '#F3E5F5' },
    'Vegan Skincare': { emoji: '🌱🧴', bg: '#E8F5E9' },
    'Paid Package Reviews': { emoji: '📦', bg: '#EDE7F6' },
};

const DEFAULT_STYLE = { emoji: '🌐', bg: '#F5F5F5' };

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
                    <TemplateText size={14} semiBold color="#555" numberOfLines={1}>
                        {brandName}
                    </TemplateText>
                    <TemplateText size={11} color="#888" mt={2}>
                        {category}
                    </TemplateText>
                </>
            )}

            {/* Spinner while image is loading */}
            {showSpinner && <ActivityIndicator size="small" color="#888" />}

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
