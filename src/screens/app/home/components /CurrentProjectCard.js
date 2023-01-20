import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../../theme/Layout';
import {
  BLACK,
  BLACK_30,
  BLACK_50,
  WHITE,
  WHITE_70,
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';

const CurrentProjectCard = ({image, style, macros}) => {
  return (
    <View style={[styles.container, style]}>
      <BackgroundImage source={image} style={styles.image} />
      <View style={styles.macrosContainer}>
        <View style={styles.macro}>
          <TemplateText size={14} color={BLACK} style={styles.macroTitle} bold>
            {macros?.brand}
          </TemplateText>
          <TemplateText size={10} color={BLACK_30} startCase>
            brand
          </TemplateText>
        </View>
        <View style={styles.macro}>
          <TemplateText size={14} color={BLACK} style={styles.macroTitle} bold>
            {macros?.daysLeft}
          </TemplateText>
          <TemplateText size={10} color={BLACK_30} startCase>
            days left
          </TemplateText>
        </View>

        <View style={styles.macro}>
          <TemplateText size={14} color={BLACK} style={styles.macroTitle} bold>
            {`${macros?.rate} ${macros?.currency}`}
          </TemplateText>
          <TemplateText size={10} color={BLACK_30} startCase>
            Amount charged
          </TemplateText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    width: SCREEN_WIDTH - 120,
    height: SCREEN_HEIGHT / 4.4,
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
  macrosContainer: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: WHITE_70,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  macro: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroTitle: {
    marginBottom: 5,
  },
});

CurrentProjectCard.propTypes = {
  image: PropTypes.string,
  macros: PropTypes.shape({
    daysLeft: PropTypes.number,
    rate: PropTypes.number,
    brand: PropTypes.string,
    currency: PropTypes.string,
  }),
  style: PropTypes.object,
};

CurrentProjectCard.defaultProps = {
  image: null,
  macros: {
    daysLeft: 0,
    rate: 0,
    brand: '',
    currency: 'USD',
  },
  style: {},
};

export default CurrentProjectCard;
