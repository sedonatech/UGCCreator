import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../../theme/Layout';
import {BLACK, BLACK_50, WHITE} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';

const BrandsCard = ({image, style, shortDescription, title}) => {
  return (
    <View style={[styles.container, style]}>
      <BackgroundImage source={image} style={styles.image} />
      <View style={styles.buttonWrapper}>
        <TemplateText color={WHITE} bold size={18} style={styles.text}>
          {title}
        </TemplateText>
        <TemplateText color={WHITE} size={14} style={styles.text}>
          {shortDescription}
        </TemplateText>
        <TemplateTouchable
          style={styles.viewOffersButton}
          onPress={() => console.log('pressed')}>
          <TemplateText color={WHITE} bold size={14}>
            View Offers
          </TemplateText>
        </TemplateTouchable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    width: SCREEN_WIDTH - 66,
    height: SCREEN_HEIGHT / 2.7,
    shadowColor: BLACK_50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  viewOffersButton: {
    backgroundColor: BLACK,
    borderRadius: 10,
    alignSelf: 'center',
    width: SCREEN_WIDTH - 86,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 10,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  text: {
    marginBottom: 5,
  },
});

BrandsCard.propTypes = {
  image: PropTypes.string,
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
