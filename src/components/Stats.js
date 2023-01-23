import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import StatsCard from './cards/StatsCard';

const Stats = ({stats, style}) => {
  return (
    <View style={[styles.statsWrapper, style]}>
      {stats?.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat?.title}
          value={stat?.value}
          icon={stat?.icon}
          color={stat?.color}
        />
      ))}
    </View>
  );
};

Stats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      icon: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    }),
  ),
  style: PropTypes.object,
};

Stats.defaultProps = {
  stats: [],
  style: {},
};

const styles = StyleSheet.create({
  statsWrapper: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});
export default Stats;
