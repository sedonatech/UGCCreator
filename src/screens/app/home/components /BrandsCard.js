import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

import {SCREEN_WIDTH} from '../../../../theme/Layout';
import {BLACK, WHITE} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import TemplateBox from '../../../../components/TemplateBox';

const BrandsCard = ({image, style, shortDescription, title}) => {
  return (
    <TemplateBox
      flex
      vGradient
      overflow="hidden"
      borderRadius={10}
      width={SCREEN_WIDTH / 1.6}
      aspectRatio={1}
      style={style}>
      <BackgroundImage source={image} style={styles.image} />
      <View style={styles.buttonWrapper}>
        <TemplateText color={WHITE} bold size={18} style={styles.text}>
          {title}
        </TemplateText>
        <TemplateText color={WHITE} size={14} style={styles.text}>
          {shortDescription}
        </TemplateText>
        <TemplateTouchable style={styles.viewOffersButton}>
          <TemplateText color={WHITE} bold size={14}>
            View Offers
          </TemplateText>
        </TemplateTouchable>
      </View>
    </TemplateBox>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    zIndex: -1,
  },
  viewOffersButton: {
    backgroundColor: BLACK,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 10,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    padding: 10,
  },
  text: {
    marginBottom: 5,
  },
});

BrandsCard.propTypes = {
  image: PropTypes.number || PropTypes.object,
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  style: PropTypes.object,
};

BrandsCard.defaultProps = {
  image: null,
  title: null,
  shortDescription: null,
  style: {},
};

export default BrandsCard;
