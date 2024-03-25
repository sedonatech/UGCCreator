import React, { forwardRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Carousel = forwardRef(
    (
        {
            children,
            cardWidth,
            cardMargin,
            style,
            contentContainerStyle,
            onScrollToNext,
            ...rest
        },
        ref,
    ) => {
        const elementWidth = cardWidth + cardMargin;

        return (
            <ScrollView
                horizontal
                decelerationRate={0}
                snapToInterval={elementWidth || 0}
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}
                style={[styles.container, style]}
                contentContainerStyle={contentContainerStyle}
                onMomentumScrollEnd={onScrollToNext}
                ref={ref}
                {...rest}
            >
                {children}
            </ScrollView>
        );
    },
);

Carousel.propTypes = {
    children: PropTypes.node.isRequired,
    cardWidth: PropTypes.number,
    cardMargin: PropTypes.number,
    style: PropTypes.shape({}),
    onScrollToNext: PropTypes.func,
    contentContainerStyle: PropTypes.shape({}),
    animated: PropTypes.bool,
};

Carousel.defaultProps = {
    cardWidth: null,
    cardMargin: null,
    style: null,
    contentContainerStyle: null,
    onScrollToNext: null,
    animated: false,
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

export default Carousel;
