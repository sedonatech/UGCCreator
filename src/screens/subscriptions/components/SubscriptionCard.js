import React from 'react';
import PropTypes from 'prop-types';

import { ACCENT, BLACK, BLACK_30, BLACK_70, DARK_METAL, WHITE } from '../../../theme/Colors';
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
    freeTrial,
    recommended,
    recommendedCopy,
    popularCopy,
    index,
}) => {
    return (
        <TemplateBox
            backgroundColor={WHITE}
            borderRadius={16}
            mt={20}
            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
            pAll={16}
            slideIn
            slideInDelay={(index + 1) * 100}
            borderWidth={1}
            borderColor={selected ? ACCENT : BLACK_30}
            onPress={onPress}
            row
            alignItems="center"
        >
            <TemplateBox mr={10}>{selected ? <SelectedSvg /> : <UnSelectedSvg />}</TemplateBox>
            <TemplateBox onPress={onPress}>
                <TemplateText bold size={16} color={BLACK} onPress={onPress}>
                    {title}
                </TemplateText>
                <TemplateBox height={8} />
                <TemplateBox row justifyContent="space-between" alignItems="center">
                    <TemplateText size={16} color={BLACK_70}>
                        {price}{' '}
                    </TemplateText>
                    <TemplateText size={16} color={BLACK_70}>
                        {billed}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
            <TemplateBox flex />

            <TemplateBox onPress={onPress} alignItems="center" justifyContent="center">
                {recommended && (
                    <TemplateBox backgroundColor={ACCENT} pv={6} ph={12} borderRadius={8} mb={8}>
                        <TemplateText size={12} color={DARK_METAL} bold caps>
                            {recommendedCopy}
                        </TemplateText>
                    </TemplateBox>
                )}
                {!!popularCopy && (
                    <TemplateBox backgroundColor={ACCENT} pv={6} ph={12} borderRadius={8} mb={8}>
                        <TemplateText size={12} color={DARK_METAL} bold caps>
                            {popularCopy}
                        </TemplateText>
                    </TemplateBox>
                )}
            </TemplateBox>
        </TemplateBox>
    );
};

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
