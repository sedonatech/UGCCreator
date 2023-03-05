import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import {
    BLACK,
    BLACK_SECONDARY, DEEP_LAVENDER, GREY_SECONDARY, WHITE,
} from '../../../theme/Colors';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { SHADOW } from '../../../theme/Shadow';

const SubscriptionCard = ({
    selected,
    onPress,
    title,
    price,
    description,
    billed,
    freeTrial,
    recommended,
    recommendedCopy,
    popularCopy,
    loading,
    index,
}) => (
    <TemplateBox
        backgroundColor={selected
            ? DEEP_LAVENDER
            : GREY_SECONDARY}
        borderRadius={10}
        mt={WRAPPER_MARGIN * 2}
        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
        pAll={WRAPPER_MARGIN}
        style={SHADOW('card', selected
            ? DEEP_LAVENDER
            : GREY_SECONDARY)}
        slideIn
        slideInDelay={(index + 1) * 100}
    >

        <TemplateBox onPress={onPress}>
            <TemplateBox
                row
                justifyContent="space-between"
                alignItems="center"
            >
                <TemplateText
                    bold
                    size={16}
                    color={selected ? WHITE : BLACK_SECONDARY}
                >
                    {title?.split(' ')[0]}
                    {' '}

                </TemplateText>
                <TemplateText
                    bold
                    size={16}
                    color={selected ? WHITE : BLACK_SECONDARY}
                >
                    {price}
                    {' '}
                </TemplateText>
                <TemplateText
                    bold
                    size={16}
                    color={selected ? WHITE : BLACK_SECONDARY}
                >
                    {billed}
                </TemplateText>
            </TemplateBox>
            <TemplateBox height={10} />
            {loading && (
                <TemplateBox selfCenter>
                    <ActivityIndicator size="small" color={BLACK} />
                </TemplateBox>
            )}
            <TemplateText
                size={14}
                color={selected ? WHITE : BLACK_SECONDARY}
            >
                {description}
            </TemplateText>
            <TemplateBox height={7} />
            <TemplateText
                size={12}
                color={selected ? WHITE : BLACK_SECONDARY}
            >
                {freeTrial?.copy}
            </TemplateText>
        </TemplateBox>

        {
            recommended && (
                <TemplateBox
                    backgroundColor={selected ? BLACK : BLACK_SECONDARY}
                    borderRadius={10}
                    pv={7}
                    ph={12}
                    absolute
                    left={230}
                    top={-15}
                    width={110}
                    height={30}
                    alignItems="center"
                >
                    <TemplateText
                        size={12}
                        color={WHITE}
                    >
                        {recommendedCopy}
                    </TemplateText>
                </TemplateBox>
            )
        }

        {
            !!popularCopy && (
                <TemplateBox
                    backgroundColor={selected ? BLACK : BLACK_SECONDARY}
                    borderRadius={10}
                    pv={7}
                    ph={12}
                    absolute
                    left={230}
                    top={-15}
                    width={110}
                    height={30}
                    alignItems="center"
                >
                    <TemplateText
                        size={12}
                        color={WHITE}
                    >
                        {popularCopy}
                    </TemplateText>
                </TemplateBox>
            )
        }
    </TemplateBox>
);

SubscriptionCard.propTypes = {
    selected: PropTypes.bool,
    onPress: PropTypes.func,
    title: PropTypes.string,
    price: PropTypes.string,
    description: PropTypes.string,
    billed: PropTypes.string,
    freeTrial: PropTypes.shape({
        copy: PropTypes.string,
    }),
    recommended: PropTypes.bool,
    recommendedCopy: PropTypes.string,
    popularCopy: PropTypes.string,
    loading: PropTypes.bool,
    index: PropTypes.number,
};

SubscriptionCard.defaultProps = {
    selected: false,
    onPress: () => {},
    title: '',
    price: '',
    description: '',
    billed: '',
    freeTrial: {
        copy: '',
    },
    recommended: false,
    recommendedCopy: '',
    popularCopy: '',
    loading: false,
    index: 0,
};
export default SubscriptionCard;
