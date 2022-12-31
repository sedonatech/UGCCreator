import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
import {startCase} from 'lodash';
import PropTypes from 'prop-types';

import TemplateText from '../../../../components/TemplateText';
import {WRAPPER_MARGIN} from '../../../../theme/Layout';
import {BLACK_SECONDARY} from '../../../../theme/Colors';

const Greeting = ({userName, style}) => {
  const hour = moment().hour();

  const today = useMemo(() => moment().startOf('day'), []);

  const activeDay = useMemo(() => today.format('MMMM Do YYYY'), [today]);

  const getTimeGreeting = hour => {
    if (hour > 16) {
      return 'Good evening, ';
    }
    if (hour > 11) {
      return 'Good afternoon, ';
    }
    return 'Good morning, ';
  };

  return (
    <View style={style}>
      <TemplateText bold size={20} style={styles.greetingTitle}>
        {`${getTimeGreeting(hour)}${startCase(userName)}!`}
      </TemplateText>
      <TemplateText
        size={16}
        color={BLACK_SECONDARY}
        style={styles.greetingTitle}>
        {activeDay}
      </TemplateText>
    </View>
  );
};

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTitle: {
    width: '75%',
    marginBottom: WRAPPER_MARGIN / 4,
  },
});

Greeting.propTypes = {
  userName: PropTypes.string.isRequired,
  style: PropTypes.object,
};

Greeting.defaultProps = {
  style: null,
};
export default Greeting;
