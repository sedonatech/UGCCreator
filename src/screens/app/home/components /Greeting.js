import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { format } from 'date-fns'
import startOfDay from 'date-fns/startOfDay';
import PropTypes from 'prop-types';

import TemplateText from '../../../../components/TemplateText';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import { BLACK_SECONDARY } from '../../../../theme/Colors';
import Avatar from '../../../../components/Avatar';

const Greeting = ({ userName, style, showAvatar }) => {
    const hour = new Date().getHours();

    const start = startOfDay(new Date())
    const today = useMemo(() => start, []);

    const activeDay = useMemo(() => format(start, 'MMMM dd yyyy'), [today]);

    const getTimeGreeting = (hour) => {
        if (hour > 16) {
            return 'Good evening, ';
        }
        if (hour > 11) {
            return 'Good afternoon, ';
        }
        return 'Good morning, ';
    };

    return (
        <View style={[styles.container, style]}>
            {showAvatar && (
                <Avatar style={styles.avatar} />
            )}
            <View>
                <TemplateText bold size={18} style={styles.greetingTitle}>
                    {`${getTimeGreeting(hour)}`}

                </TemplateText>
                <TemplateText bold size={18} style={styles.greetingTitle}>
                    {`${userName?.replace(/-/g, ' ')?.toLowerCase()?.split(' ')?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ')}!`}
                </TemplateText>
                <TemplateText
                    size={13}
                    color={BLACK_SECONDARY}
                    style={styles.greetingTitle}
                >
                    {activeDay}
                </TemplateText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingTitle: {
        marginBottom: WRAPPER_MARGIN / 3,
    },
    avatar: {
        marginRight: WRAPPER_MARGIN / 1.6,
    },
});

Greeting.propTypes = {
    userName: PropTypes.string.isRequired,
    style: PropTypes.shape({}),
    showAvatar: PropTypes.bool,
};

Greeting.defaultProps = {
    style: null,
    showAvatar: true,
};
export default Greeting;
