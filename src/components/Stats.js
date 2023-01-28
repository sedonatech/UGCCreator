import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import StatsCard from './cards/StatsCard';
import TemplateBox from './TemplateBox';

const Stats = ({stats, style}) => {
  return (
    <TemplateBox
      pAll={20}
      row
      spaceBetween
      flexWrap={'wrap'}
      style={[styles.statsWrapper, style]}>
      {stats?.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat?.title}
          value={stat?.value}
          icon={stat?.icon}
          color={stat?.color}
          slideInDelayTime={(index + 1) * 0.5}
        />
      ))}
    </TemplateBox>
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
    justifyContent: 'space-between',
  },
});
export default Stats;
