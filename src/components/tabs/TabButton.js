import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BLACK } from '../../theme/Colors';
import { IS_ANDROID } from '../../theme/Layout';
import DynamicIcon from '../icons/DynamicIcon';

const TabButton = ({ focused, icon }) => (
    <View style={[styles.container, focused && styles.activeContainer]}>
        <DynamicIcon
            name={icon}
            size={24}
            color={BLACK}
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
        flex: 1,
    },
    activeContainer: {
        opacity: 1,
    },

});

export default TabButton;
