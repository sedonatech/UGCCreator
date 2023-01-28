import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import TemplateText from '../TemplateText';
import {BLACK, BLACK_50, DEEP_PURPLE, WHITE} from '../../theme/Colors';
import {SCREEN_WIDTH} from '../../theme/Layout';
import TemplateIcon from '../TemplateIcon';
import TemplateBox from '../TemplateBox';

const StatsCard = ({title, value, icon, color, slideInDelayTime}) => {
  return (
    <TemplateBox
      pAll={10}
      mb={10}
      borderRadius={10}
      slideIn
      slideInTime={slideInDelayTime}
      backgroundColor={WHITE}
      shadow
      width={SCREEN_WIDTH / 2 - 30}>
      <TemplateText color={DEEP_PURPLE} size={12} semiBold>
        {title}
      </TemplateText>
      <View style={styles.valueWrapper}>
        <View style={[styles.emojiContainer, {backgroundColor: color}]}>
          <TemplateIcon size={18} color={BLACK} name={icon} family="Ionicons" />
        </View>
        <TemplateText bold size={18} color={DEEP_PURPLE}>
          {value}
        </TemplateText>
      </View>
    </TemplateBox>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  icon: PropTypes.string,
  color: PropTypes.string,
  slideInDelayTime: PropTypes.number,
};

StatsCard.defaultProps = {
  title: '',
  value: 0,
  icon: '',
  color: '',
  slideInDelayTime: 0,
};

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: WHITE,
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  emojiContainer: {
    height: 30,
    width: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
export default StatsCard;
