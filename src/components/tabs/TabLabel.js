import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BLACK, BRAND_BLUE } from '../../theme/Colors';
import TemplateText from '../TemplateText';
import { IS_ANDROID } from '../../theme/Layout';

const TabLabel = ({ focused, children }) => (
    <TemplateText black style={[styles.label, focused && styles.activeLabel]}>
        {children}
    </TemplateText>
);

TabLabel.propTypes = {
    children: PropTypes.node.isRequired,
    focused: PropTypes.bool,
};

TabLabel.defaultProps = {
    focused: false,
};

const styles = StyleSheet.create({
    label: {
        color: BRAND_BLUE,
        fontSize: 10,
        opacity: 0.5,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: IS_ANDROID ? 4 : 0,
    },
    activeLabel: {
        opacity: 1,
    },
});

export default TabLabel;
