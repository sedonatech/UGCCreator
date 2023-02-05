import React from 'react';

import FastImage from 'react-native-fast-image';

const ResizedImage = ({
  width,
  height,
  fit,
  source,
  position,
  style,
  onLoadEnd,
  noResize,
  ...restProps
}) => {
  return (
    <FastImage
      {...restProps}
      source={source}
      onLoadEnd={onLoadEnd}
      style={style}
    />
  );
};

export default ResizedImage;
