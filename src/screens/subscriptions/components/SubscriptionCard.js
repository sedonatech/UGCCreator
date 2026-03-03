import React from 'react';
import PropTypes from 'prop-types';

import {
    ACCENT,
    BLACK,
    WHITE,
    WHITE_10,
    WHITE_20,
    WHITE_60,
    WHITE_70,
    WHITE_80,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import useTranslation from '../../../hooks/useTranslation';

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
    description,
    savingPercent,
    introPrice,
    originalPrice,
    index,
}) => {
    const { t } = useTranslation();
    const badgeLabel = recommended ? recommendedCopy : popularCopy;
    const currentPrice = introPrice || price;
    const showAdditionalDetails = !!description || !!freeTrial?.copy;
    const helperCopy = description || freeTrial?.copy;

    return (
        <TemplateBox
            backgroundColor={selected ? WHITE_10 : 'rgba(255, 255, 255, 0.04)'}
            borderRadius={20}
            mt={12}
            width="100%"
            pv={16}
            ph={16}
            slideIn
            slideInDelay={(index + 1) * 100}
            borderWidth={1}
            borderColor={selected ? ACCENT : WHITE_20}
            onPress={onPress}
            style={{
                shadowColor: BLACK,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: selected ? 0.18 : 0.08,
                shadowRadius: 20,
                elevation: selected ? 8 : 2,
            }}
        >
            <TemplateBox row alignItems="flex-start">
                <TemplateBox mr={14} mt={1}>
                    <TemplateIcon
                        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                        color={selected ? ACCENT : WHITE_70}
                        size={24}
                    />
                </TemplateBox>

                <TemplateBox flex onPress={onPress}>
                    <TemplateBox row alignItems="center" justifyContent="space-between">
                        <TemplateBox flex mr={12}>
                            <TemplateText bold size={18} color={WHITE} onPress={onPress}>
                                {title}
                            </TemplateText>
                        </TemplateBox>

                        {!!badgeLabel && (
                            <TemplateBox
                                backgroundColor={selected ? WHITE_20 : 'rgba(255, 255, 255, 0.08)'}
                                pv={5}
                                ph={10}
                                borderRadius={999}
                            >
                                <TemplateText size={10} color={selected ? ACCENT : WHITE_80} bold caps>
                                    {badgeLabel}
                                </TemplateText>
                            </TemplateBox>
                        )}
                    </TemplateBox>

                    <TemplateBox row alignItems="center" style={{ marginTop: 6, flexWrap: 'wrap' }} onPress={onPress}>
                        <TemplateText bold size={16} color={WHITE} onPress={onPress}>
                            {currentPrice}
                        </TemplateText>
                        {!!billed && (
                            <TemplateText size={14} color={WHITE_80} ml={6} onPress={onPress}>
                                {billed}
                            </TemplateText>
                        )}
                        {!!originalPrice && !!introPrice && (
                            <TemplateText
                                size={12}
                                color={WHITE_60}
                                lineThrough
                                ml={8}
                                onPress={onPress}
                            >
                                {originalPrice}
                            </TemplateText>
                        )}
                    </TemplateBox>

                    {!!introPrice && !!price && !!billed && (
                        <TemplateText
                            size={12}
                            color={WHITE_70}
                            style={{ marginTop: 6 }}
                            onPress={onPress}
                        >
                            {t('subscriptions.card.thenPrice', { price, billed })}
                        </TemplateText>
                    )}

                    {selected && showAdditionalDetails && (
                        <TemplateText
                            size={12}
                            color={WHITE_70}
                            style={{ marginTop: 8, lineHeight: 18 }}
                            numberOfLines={2}
                            onPress={onPress}
                        >
                            {helperCopy}
                        </TemplateText>
                    )}

                    {!!savingPercent && (
                        <TemplateBox
                            backgroundColor={selected ? WHITE_20 : 'rgba(255, 255, 255, 0.08)'}
                            pv={5}
                            ph={9}
                            borderRadius={999}
                            style={{ marginTop: 10, alignSelf: 'flex-start' }}
                        >
                            <TemplateText size={10} color={selected ? ACCENT : WHITE_80} bold caps>
                                {t('subscriptions.card.saveBadge', { percent: savingPercent })}
                            </TemplateText>
                        </TemplateBox>
                    )}
                </TemplateBox>
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
    description: PropTypes.string,
    savingPercent: PropTypes.string,
    introPrice: PropTypes.string,
    originalPrice: PropTypes.string,
    index: PropTypes.number,
};

SubscriptionCard.defaultProps = {
    selected: false,
    onPress: () => { },
    title: '',
    price: '',
    billed: '',
    freeTrial: {
        copy: '',
    },
    recommended: false,
    recommendedCopy: '',
    popularCopy: '',
    description: '',
    savingPercent: '',
    introPrice: '',
    originalPrice: '',
    index: 0,
};
export default SubscriptionCard;
