import React, { FC } from 'react';
import { Alert } from 'react-native';
import { WHITE } from '../../../theme/Colors';
import {
    SCREEN_WIDTH,
    WRAPPED_SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateText from '../../../components/TemplateText';
import TemplateBox from '../../../components/TemplateBox';
import { SHADOW } from '../../../theme/Shadow';
import CatalogueSvg from '../../../../assets/svgs/CatalogueSvg';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import { SUBSCRIPTION } from '../../../navigation/ScreenNames';

const { trackEvent } = useTrackEvent();

interface Props {
    navigation: any;
    item: Record<string, any>;
    isActive: boolean;
    isUnlockedUser: boolean;
    setSelectedBrand: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const BrandsCatalogueCard: FC<Props> = ({
    navigation,
    item,
    isActive,
    isUnlockedUser,
    setSelectedBrand,
    setModalVisible
}) =>  {
    return (
        <TemplateBox
            row
            alignItems="center"
            backgroundColor={WHITE}
            borderRadius={16}
            pAll={20}
            width={WRAPPED_SCREEN_WIDTH}
            mt={WRAPPER_MARGIN}
            onPress={() => {
                if (!isUnlockedUser && !isActive) {
                    Alert.alert(
                        'Activate Subscription',
                        'You need to have at least a monthly subscription to unlock all the brands',
                        [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate(
                                    SUBSCRIPTION, {
                                        fromSettings: true,
                                    },
                                    trackEvent('access_subscription_from_brand_catalogue', {
                                        brandName: item['Brand Name'],
                                    }),
                                ),
                                style: 'cancel',
                            },
                        ],
                        { cancelable: false },
                    );
                } else {
                    setSelectedBrand(item);
                    setTimeout(() => {
                        setModalVisible(true);
                    }, 100);
                }
            }}
            style={SHADOW('card', WHITE)}
            selfCenter
            mh={WRAPPER_MARGIN}
            opacity={(isActive || isUnlockedUser) ? 1 : 0.5}
        >
            <CatalogueSvg />
            <TemplateBox width={16} />
            <TemplateBox
                width={SCREEN_WIDTH / 1.6}
                onPress={() => {
                    if (!isUnlockedUser && !isActive) {
                        Alert.alert(
                            'Activate Subscription to Unlock All Brands',
                            'You need to have at least a monthly subscription to unlock all the brands',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => navigation.navigate(
                                        SUBSCRIPTION, {
                                            fromSettings: true,
                                        },
                                        trackEvent('access_subscription_from_brand_catalogue', {
                                            brandName: item['Brand Name'],
                                        }),
                                    ),
                                    style: 'cancel',
                                },
                            ],
                            { cancelable: false },
                        );
                    } else {
                        setSelectedBrand(item);
                        setTimeout(() => {
                            setModalVisible(true);
                        }, 100);
                    }
                }}
            >
                <TemplateText bold size={16}>{item?.['Brand Name']}</TemplateText>
                <TemplateBox height={5} />
                <TemplateText size={13}>{`Instagram: ${item?.Instagram}`}</TemplateText>
                <TemplateBox height={5} />
                <TemplateText size={13}>{`Press to reach out to ${item?.['Brand Name']} for a potential UGC collaboration`}</TemplateText>
            </TemplateBox>
        </TemplateBox>
    );
};

export default BrandsCatalogueCard;
