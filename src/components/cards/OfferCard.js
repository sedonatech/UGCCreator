import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import TemplateTouchable from '../TemplateTouchable';
import {
    CATEGORY_CARD_HEIGHT,
    CATEGORY_CARD_WIDTH,
    RADIUS_SMALL,
    WRAPPER_MARGIN,
} from '../../theme/Layout';
import { BLACK, BLACK_30 } from '../../theme/Colors';
import TemplateText from '../TemplateText';
import TemplateIcon from '../TemplateIcon';

const OfferCard = ({
    onPress, title, icon, proposalCount, style,
}) => {
    const Component = onPress ? TemplateTouchable : View;

    return (
        <Component onPress={onPress} style={[styles.container, style]}>
            <View style={styles.iconContainer}>
                <TemplateIcon name={icon} family="Ionicons" size={26} color={BLACK} />
                <TemplateText style={styles.proposalCount} size={16} color={BLACK_30}>
                    {proposalCount}
                </TemplateText>
            </View>
            <View style={styles.textContainer}>
                <TemplateText style={styles.title} size={18}>
                    {title}
                </TemplateText>
            </View>
        </Component>
    );
};

OfferCard.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.string,
    proposalCount: PropTypes.string,
    style: PropTypes.object,
};

OfferCard.defaultProps = {
    onPress: () => {},
    title: 'Title',
    icon: 'Icon',
    proposalCount: '',
    style: {},
};

const styles = StyleSheet.create({
    container: {
        height: CATEGORY_CARD_HEIGHT,
        width: CATEGORY_CARD_WIDTH,
        borderRadius: RADIUS_SMALL,
        borderWidth: 0.4,
        borderColor: BLACK_30,
        paddingHorizontal: WRAPPER_MARGIN,
        paddingVertical: WRAPPER_MARGIN,
        justifyContent: 'space-between',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default OfferCard;
