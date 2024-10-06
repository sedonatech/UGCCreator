import React from 'react';
import PropTypes from 'prop-types';

import {
    BLACK, BLACK_70, IOS_BLUE, WHITE,
} from '../../../theme/Colors';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import SelectedSvg from '../../../../assets/svgs/SelectedSvg';
import UnSelectedSvg from '../../../../assets/svgs/UnselectedSvg';

const SubscriptionCard = ({
    selected,
    onPress,
    title,
    price,
    billed,
    recommended,
    recommendedCopy,
    popularCopy,
    index,
}) => (
    <TemplateBox
        backgroundColor={WHITE}
        borderRadius={16}
        mt={16}
        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
        pAll={16}
        slideIn
        slideInDelay={(index + 1) * 100}
        borderWidth={2}
        borderColor={selected ? IOS_BLUE : 'transparent'}
        onPress={onPress}
        row
        alignItems="center"
    >
        <TemplateBox mr={10}>
            {
                selected ? (
                    <SelectedSvg />
                ) : (
                    <UnSelectedSvg />
                )
            }
        </TemplateBox>
        <TemplateBox
            onPress={onPress}
        >
            <TemplateText
                bold
                size={15}
                color={BLACK}
                onPress={onPress}
            >
                {/* eslint-disable-next-line no-nested-ternary */}
                {title?.includes('Annual')
                    ? 'Annual'
                    : title?.includes('Quarterly')
                        ? 'Quarterly'
                        : 'Monthly'}
            </TemplateText>
            <TemplateBox height={8} />
            <TemplateBox
                row
                justifyContent="space-between"
                alignItems="center"
            >
                <TemplateText
                    size={13}
                    color={BLACK_70}
                >
                    {price}
                    {' '}
                </TemplateText>
                <TemplateText
                    size={13}
                    color={BLACK_70}
                >
                    {billed}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
        <TemplateBox flex />

        {
            recommended && (
                <TemplateBox
                    backgroundColor={IOS_BLUE}
                    borderRadius={10}
                    pv={7}
                    ph={12}
                    width={110}
                    height={30}
                    alignItems="center"
                    onPress={onPress}
                >
                    <TemplateText
                        size={12}
                        color={WHITE}
                        bold
                        caps
                    >
                        {recommendedCopy}
                    </TemplateText>
                </TemplateBox>
            )
        }

        {
            !!popularCopy && (
                <TemplateBox
                    backgroundColor={IOS_BLUE}
                    borderRadius={10}
                    pv={7}
                    ph={12}
                    width={130}
                    height={30}
                    alignItems="center"
                    onPress={onPress}
                >
                    <TemplateText
                        size={12}
                        color={WHITE}
                        bold
                        caps
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
    billed: PropTypes.string,
    freeTrial: PropTypes.shape({
        copy: PropTypes.string,
    }),
    recommended: PropTypes.bool,
    recommendedCopy: PropTypes.string,
    popularCopy: PropTypes.string,
    index: PropTypes.number,
};

SubscriptionCard.defaultProps = {
    selected: false,
    onPress: () => {},
    title: '',
    price: '',
    billed: '',
    freeTrial: {
        copy: '',
    },
    recommended: false,
    recommendedCopy: '',
    popularCopy: '',
    index: 0,
};
export default SubscriptionCard;
