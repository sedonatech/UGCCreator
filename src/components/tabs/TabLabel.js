import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BRAND_BLUE, ERROR_RED } from '../../theme/Colors';
import TemplateText from '../TemplateText';
import { IS_ANDROID } from '../../theme/Layout';
import TemplateBox from '../TemplateBox';

const TabLabel = ({ focused, children, showNotification }) => (
    <TemplateBox row center>
        <TemplateText
            opacity={focused ? 1 : 0.5}
            black
            semiBold
            style={[styles.label, focused && styles.activeLabel]}
        >
            {children}
        </TemplateText>
        {!!showNotification && (
            <TemplateBox
                width={4}
                height={4}
                borderRadius={4}
                zIndex={999}
                backgroundColor={ERROR_RED}
                style={styles.label}
            />
        )}
    </TemplateBox>
);

TabLabel.propTypes = {
    children: PropTypes.node.isRequired,
    focused: PropTypes.bool,
    showNotification: PropTypes.number,
};

TabLabel.defaultProps = {
    focused: false,
    showNotification: 0,
};

const styles = StyleSheet.create({
    label: {
        color: BRAND_BLUE,
        fontSize: 10,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: IS_ANDROID ? 4 : 0,
    },
    activeLabel: {
        opacity: 1,
    },
});

export default TabLabel;
