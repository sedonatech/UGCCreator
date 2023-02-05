import React from 'react';
import PropTypes from 'prop-types';
import StatsCard from './cards/StatsCard';
import TemplateBox from './TemplateBox';

const Stats = ({ stats, style }) => (
    <TemplateBox
        pAll={20}
        row
        flexWrap="wrap"
        justifyContent="space-between"
        style={style}
    >
        {stats?.map((stat, index) => (
            <StatsCard
                key={index}
                title={stat?.title}
                value={stat?.value}
                icon={stat?.icon}
                color={stat?.color}
                slideInDelayTime={(index + 1) * 100}
            />
        ))}
    </TemplateBox>
);

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

export default Stats;
