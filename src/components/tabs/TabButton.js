import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import TemplateIcon from '../TemplateIcon';
import { BLACK } from '../../theme/Colors';
import { IS_ANDROID } from '../../theme/Layout';

const TabButton = ({ focused, icon }) => (
    <View style={[styles.container, focused && styles.activeContainer]}>
        <TemplateIcon
            name={icon}
            style={styles.icon}
            size={24}
            color={BLACK}
            family="Ionicons"
        />
    </View>
);

TabButton.propTypes = {
    focused: PropTypes.bool.isRequired,
    icon: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    container: {
        opacity: 0.3,
        marginTop: IS_ANDROID ? 5 : 8,
        width: '100%',
        flex: 1,
    },
    activeContainer: {
        opacity: 1,
    },
    icon: {
        height: 26,
        textAlign: 'center',
    },
});

export default TabButton;
