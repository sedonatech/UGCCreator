import React, {forwardRef} from 'react';
import Animated from 'react-native-reanimated';
import {ScrollView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const Carousel = forwardRef(
  (
    {
      children,
      cardWidth,
      cardMargin,
      style,
      contentContainerStyle,
      animated,
      onScrollToNext,
      ...rest
    },
    ref,
  ) => {
    const elementWidth = cardWidth + cardMargin;

    const Component = animated ? Animated.ScrollView : ScrollView;

    return (
      <Component
        horizontal
        decelerationRate={0}
        snapToInterval={elementWidth || 0}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        style={[styles.container, style]}
        contentContainerStyle={contentContainerStyle}
        onMomentumScrollEnd={onScrollToNext}
        ref={ref}
        {...rest}>
        {children}
      </Component>
    );
  },
);

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  cardWidth: PropTypes.number,
  cardMargin: PropTypes.number,
  style: PropTypes.object,
  onScrollToNext: PropTypes.func,
  contentContainerStyle: PropTypes.object,
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
