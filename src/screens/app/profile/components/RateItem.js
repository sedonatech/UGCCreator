import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import { SHADOW } from '../../../../theme/Shadow';
import {
    BLACK, BLACK_40, GREY_SECONDARY, WHITE,
} from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateTextInput from '../../../../components/TemplateTextInput';

const RateItem = ({
    title,
    description,
    onChangeText,
    value,
}) => (
    <TemplateBox
        selfCenter
        alignItems="center"
        width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
        borderRadius={10}
        mb={10}
        pAll={WRAPPER_MARGIN}
        style={SHADOW('default', GREY_SECONDARY)}
    >
        <TemplateText
            bold
            size={16}
            color={BLACK}
            center
        >
            {title}
        </TemplateText>
        <TemplateBox height={10} />
        <TemplateText
            size={14}
            color={BLACK_40}
            center
        >
            {description}
        </TemplateText>
        <TemplateBox height={10} />
        <TemplateTextInput
            placeholder="Enter rate"
            onChangeText={onChangeText}
            value={value}
            style={styles.input}
        />

    </TemplateBox>
);

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        backgroundColor: WHITE,
        borderRadius: 10,
        paddingHorizontal: 20,
        fontSize: 14,
        color: BLACK,
        ...SHADOW('default', WHITE),
    },
});

RateItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default RateItem;
