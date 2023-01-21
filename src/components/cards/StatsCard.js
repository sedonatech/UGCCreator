import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import TemplateText from '../TemplateText';
import {BLACK, BLACK_50, DEEP_PURPLE, WHITE} from '../../theme/Colors';
import {SCREEN_WIDTH} from '../../theme/Layout';
import TemplateIcon from '../TemplateIcon';

const StatsCard = ({title, value, icon, color}) => {
  return (
    <View style={styles.statsContainer}>
      <TemplateText color={DEEP_PURPLE} size={12} semiBold>
        {title}
      </TemplateText>
      <View style={styles.valueWrapper}>
        <View style={[styles.emojiContainer, {backgroundColor: color}]}>
          <TemplateIcon size={18} color={BLACK} name={icon} />
        </View>
        <TemplateText bold size={18} color={DEEP_PURPLE}>
          {value}
        </TemplateText>
      </View>
    </View>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  icon: PropTypes.string,
  color: PropTypes.string,
};

StatsCard.defaultProps = {
  title: '',
  value: 0,
  icon: '',
  color: '',
};

const styles = StyleSheet.create({
  statsContainer: {
    width: SCREEN_WIDTH / 2 - 30,
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: BLACK_50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
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
