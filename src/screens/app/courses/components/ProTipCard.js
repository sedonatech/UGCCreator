/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import { ZINC_500, INDIGO_100, INDIGO_600, INDIGO_700, TIP_GRADIENT } from '../../../../theme/Colors';

const ProTipCard = ({ tip }) => {
    if (!tip) return null;

    return (
        <TemplateBox style={styles.tipCard} overflow="hidden">
            <LinearGradient colors={TIP_GRADIENT} style={styles.gradientTipCard} />
            <TemplateBox style={styles.tipIcon}>
                <TemplateIcon name="bulb" size={14} color={INDIGO_600} />
            </TemplateBox>
            <TemplateBox style={styles.tipContent}>
                <TemplateText size={12} medium color={INDIGO_700} mb={4}>
                    Pro Tip of the Day
                </TemplateText>
                <TemplateBox width="80%">
                    <TemplateText size={12} color={styles.textMuted.color} lineHeight={18}>
                        {tip}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    );
};

ProTipCard.propTypes = {
    tip: PropTypes.string,
};

export default ProTipCard;

const styles = StyleSheet.create({
    tipCard: {
        marginTop: 6,
        padding: 14,
        borderRadius: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: INDIGO_100,
    },
    gradientTipCard: {
        ...StyleSheet.absoluteFill,
    },
    tipIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: INDIGO_100,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    tipContent: {
        flex: 1,
    },
    textMuted: {
        color: ZINC_500,
    },
});
