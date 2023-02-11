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
import { BLACK_30, BLUE, LIGHT_PURPLE } from '../../theme/Colors';
import TemplateText from '../TemplateText';
import TemplateIcon from '../TemplateIcon';

const CategoryCard = ({
    onPress, title, icon, proposalCount, style,
}) => {
    const Component = onPress ? TemplateTouchable : View;

    return (
        <Component onPress={onPress} style={[styles.container, style]}>
            <View style={styles.iconContainer}>
                <TemplateIcon name={icon} family="Ionicons" size={24} color={BLUE} />
            </View>

            <TemplateText style={styles.title} size={14}>
                {title}
            </TemplateText>
        </Component>
    );
};

CategoryCard.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.string,
    proposalCount: PropTypes.string,
    style: PropTypes.object,
};

CategoryCard.defaultProps = {
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
        borderRadius: RADIUS_SMALL * 2,
        borderWidth: 0.4,
        borderColor: BLACK_30,
        paddingVertical: WRAPPER_MARGIN,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: LIGHT_PURPLE,
        padding: 10,
        borderRadius: 50,
        marginBottom: 10,
    },
});

export default CategoryCard;
