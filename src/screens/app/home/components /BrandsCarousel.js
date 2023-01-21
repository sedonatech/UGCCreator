import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SCREEN_WIDTH, WRAPPER_MARGIN} from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import CardCarousel from '../../../../components/carousels/CardCarousel';
import {BRANDS} from '../../../../consts/content/Home';
import {BLACK, BLACK_50, BLUE} from '../../../../theme/Colors';
import BrandsCard from './BrandsCard';
import PropTypes from 'prop-types';
const BrandsCarousel = ({style}) => {
  return (
    <View style={style}>
      <View style={styles.titleContainer}>
        <TemplateText size={18}>Top Brands </TemplateText>
        <TemplateTouchable>
          <TemplateText startCase size={14} underLine color={BLUE}>
            See All
          </TemplateText>
        </TemplateTouchable>
      </View>
      <TemplateText size={14} color={BLACK_50} style={styles.subtitle}>
        Check the hot deals offered by our top brands
      </TemplateText>

      <CardCarousel
        cardMargin={20}
        smallCardWidth={SCREEN_WIDTH - 66}
        style={styles.cardCarousel}>
        {BRANDS.map((item, index) => (
          <BrandsCard
            key={item?.id}
            image={item?.image}
            title={item?.name}
            shortDescription={item?.shortDescription}
            style={styles.card}
          />
        ))}
      </CardCarousel>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WRAPPER_MARGIN,
    marginVertical: WRAPPER_MARGIN,
  },
  cardCarousel: {
    width: SCREEN_WIDTH,
    paddingHorizontal: WRAPPER_MARGIN,
    paddingVertical: 10,
  },
  card: {
    marginRight: WRAPPER_MARGIN,
  },
  subtitle: {
    marginLeft: WRAPPER_MARGIN,
  },
});

BrandsCarousel.propTypes = {
  style: PropTypes.object,
};

BrandsCarousel.defaultProps = {
  style: {},
};
export default BrandsCarousel;
