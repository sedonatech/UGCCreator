import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SCREEN_WIDTH, WRAPPER_MARGIN} from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import CardCarousel from '../../../../components/carousels/CardCarousel';
import {CURRENT_PROJECTS} from '../../../../consts/content/Home';

import {BLUE} from '../../../../theme/Colors';
import CurrentProjectCard from './CurrentProjectCard';
import PropTypes from 'prop-types';
const CurrentProjectsCarousel = ({style}) => {
  return (
    <View style={style}>
      <View style={styles.titleContainer}>
        <TemplateText bold size={18}>
          Your Active Projects{' '}
        </TemplateText>
        <TemplateTouchable>
          <TemplateText startCase size={14} underLine color={BLUE}>
            See All
          </TemplateText>
        </TemplateTouchable>
      </View>

      <CardCarousel
        cardMargin={20}
        smallCardWidth={SCREEN_WIDTH - 120}
        style={styles.cardCarousel}>
        {CURRENT_PROJECTS.map((item, index) => (
          <CurrentProjectCard
            key={item?.id}
            image={item?.image}
            macros={item?.macros}
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
});

CurrentProjectsCarousel.propTypes = {
  style: PropTypes.object,
};

CurrentProjectsCarousel.defaultProps = {
  style: {},
};
export default CurrentProjectsCarousel;
