import React, { useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator, ScrollView, StyleSheet,
} from 'react-native';
import TemplateText from '../../components/TemplateText';
import useSubscriptionContext from './useSubscriptionContext';
import useRestorePurchases from './useRestorePurchases';
import usePurchase from './usePurchase';
import useAvailablePackages from './useAvailablePackages';
import TemplateBox from '../../components/TemplateBox';
import {
    SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../theme/Layout';
import {
    BLACK, BLACK_10, IOS_BLUE, WHITE,
} from '../../theme/Colors';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import SubscriptionCard from './components/SubscriptionCard';
import useLogout from '../app/profile/useLogout';
import { useConfig } from '../../context/core';
import { WEBVIEW } from '../../navigation/ScreenNames';
import HeaderIconButton from '../../components/header/HeaderButton';

const SubscriptionScreen = ({ navigation, route }) => {
    const fromSettings = route?.params?.fromSettings;
    const subscription = useSubscriptionContext();

    const { logout: handleLogout } = useLogout();

    const { mainDomain } = useConfig();

    const [loading, setLoading] = useState(false);

    const [subscribing, setSubscribing] = useState(null);

    const [selected, setSelectedPackage] = useState(0);

    const [error, setError] = useState(null);

    const restorePurchases = useRestorePurchases();

    const [packages, originalPackages] = useAvailablePackages(subscription?.purchase);

    const purchase = usePurchase();

    const onSubscribe = async (i) => {
        setLoading(true);
        if (error) setError(null);
        let index = selected;
        if (typeof i === 'number') {
            index = i;
        }
        try {
            const availablePackage = originalPackages[index];
            if (selected === null || !availablePackage) {
                setLoading(false);
                throw Error('No selected package option');
            }
            const purchaseMade = await purchase(availablePackage);
            console.log('[PurchaseInjector] - onSubscribe: Purchase Made', purchaseMade);
            return purchaseMade;
        } catch (e) {
            console.log('[PurchaseInjector] - onSubscribe Error', e);
            setLoading(false);
            setError(e);
            return false;
        }
    };

    const onRestore = async () => {
        try {
            setLoading(true);
            await restorePurchases();
        } catch (e) {
            console.log('[onRestore] - error', e);
            alert(e?.message);
        } finally {
            setLoading(false);
        }
    };

    const setSelected = (item) => {
        if (typeof item !== 'number') {
            console.error('[SubscriptionScreenInjector] - onSelectPackage error: Incorrect data passed, only value of type int is allowed');
            return;
        }
        setSelectedPackage(item);
    };

    const handleSubscription = async (index) => {
        try {
            setSelected(index);
            setSubscribing(index);
            await onSubscribe(index);
            setSubscribing(false);
        } catch (er) {
            alert(er.message);
            setSubscribing(false);
        }
    };
    const getSavings = (pack) => {
        const monthlyPackage = packages?.length && packages?.find(({ identifier }) => identifier?.includes('monthly'));
        const monthlyPrice = monthlyPackage?.isSale
            ? monthlyPackage?.originalPrice || monthlyPackage?.introPrice
            : monthlyPackage?.price;
        const convertedMonthlyPrice = typeof monthlyPrice === 'string' ? parseFloat(monthlyPrice.replace(/[^0-9.,]+/, '')) : monthlyPrice;
        const fullMonthlyPrice = convertedMonthlyPrice * 12;

        const packPrice = pack?.isSale ? pack?.introPrice : pack?.price;

        const isQuarterly = pack?.identifier?.includes('quarterly');
        const savingPrice = packPrice * (isQuarterly ? 4 : 1);

        const saving = Math.round(100 - ((savingPrice / fullMonthlyPrice) * 100));

        return `${saving}%`;
    };

    useLayoutEffect(() => {
        if (fromSettings) {
            navigation.setOptions({
                headerLeft: () => (
                    <HeaderIconButton
                        name="chevron-back-outline"
                        onPress={() => navigation.goBack()}
                        backDropColor={BLACK_10}
                        ml={WRAPPER_MARGIN}
                    />
                ),
            });
        }
    }, [fromSettings, navigation]);
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox selfCenter>
                <BrandLogo height={SCREEN_HEIGHT / 4} width={SCREEN_WIDTH / 1.9} />
            </TemplateBox>
            <TemplateBox
                flex
                backgroundColor={WHITE}
                borderTopLeftRadius={20}
                borderTopRightRadius={20}
            >
                <TemplateBox selfCenter ph={WRAPPER_MARGIN} mt={WRAPPER_MARGIN}>
                    <TemplateText
                        bold
                        size={18}
                        center
                        color={BLACK}
                        lineHeight={26}
                        startCase
                    >
                        Choose your plan and get unlimited access
                    </TemplateText>
                    <TemplateBox height={20} />
                    <TemplateText
                        size={14}
                        color={BLACK}
                        center
                    >
                        Get Access To the world's largest platform for UGC Creators and brands
                    </TemplateText>
                    <TemplateBox height={10} />
                </TemplateBox>

                <TemplateBox mh={WRAPPER_MARGIN}>
                    {
                        packages?.length ? (
                            packages.map((pack, index) => (
                                <SubscriptionCard
                                    onPress={() => handleSubscription(index)}
                                    key={pack?.title}
                                    title={pack?.title}
                                    price={pack?.priceString}
                                    description={pack?.description}
                                    selected={selected === index}
                                    index={index}
                                    isSale
                                    savingPercent={pack?.showSaving && getSavings(pack)}
                                    introPrice={pack?.introPrice}
                                    billed={pack?.billed}
                                    originalPrice={pack?.originalPrice}
                                    freeTrial={pack?.freeTrial}
                                    recommended={pack?.recommended}
                                    recommendedCopy={pack?.recommendedCopy}
                                    popularCopy={pack?.popularCopy}
                                    loading={index === subscribing}
                                />
                            ))
                        ) : (
                            <TemplateBox selfCenter alignItems="center" justifyContent="center">
                                <ActivityIndicator color={BLACK} size="small" />
                            </TemplateBox>
                        )
                    }

                </TemplateBox>
                <TemplateBox
                    onPress={onRestore}
                    selfCenter
                    mv={WRAPPER_MARGIN}
                    mh={WRAPPER_MARGIN}
                >
                    <TemplateText caps color={IOS_BLUE} semiBold size={12} underLine>
                        restore subscription
                    </TemplateText>
                </TemplateBox>
                <TemplateBox ph={WRAPPER_MARGIN} mb={WRAPPER_MARGIN}>
                    <TemplateText size={12} color={BLACK} center small>
                        By selecting a subscription plan you agree to our
                        {' '}
                        <TemplateText
                            semiBold
                            black
                            size={14}
                            underLine
                            onPress={() => {
                                if (mainDomain) {
                                    navigation.navigate(WEBVIEW, {
                                        url: mainDomain,
                                    });
                                }
                            }}
                        >
                            terms and conditions
                        </TemplateText>

                        <TemplateText
                            black
                            center
                            size={14}
                        >
                            {' '}
                            and
                            {' '}
                        </TemplateText>
                        <TemplateText
                            black
                            semiBold
                            size={14}
                            underLine
                            onPress={() => {
                                if (mainDomain) {
                                    navigation.navigate(WEBVIEW, {
                                        url: mainDomain,
                                    });
                                }
                            }}
                        >
                            privacy policy.
                            {' '}
                        </TemplateText>
                        Your subscription will automatically renew unless auto-renew is
                        turned off at least 24 hours before the end of the current period.
                        You can manage subscriptions at any time, and turn off auto-renewal
                        in your iTunes settings after purchase if you choose. We will create
                        you an account that will allow you to access our content on any iOS
                        devices and you may choose to add additional devices as you require.
                    </TemplateText>
                </TemplateBox>
                <TemplateBox
                    selfCenter
                    mb={WRAPPER_MARGIN * 2}
                    mh={WRAPPER_MARGIN}
                    onPress={() => handleLogout()}
                >
                    <TemplateText caps color={IOS_BLUE} semiBold size={12} underLine>
                        logout
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default SubscriptionScreen;
