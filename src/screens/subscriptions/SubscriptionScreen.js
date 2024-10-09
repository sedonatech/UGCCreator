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
    SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../theme/Layout';
import {
    BLACK, BLACK_10, BLACK_60, DARK_GREY, IOS_BLUE, PAYWALL_PRIMARY_BACKGROUND, WHITE,
} from '../../theme/Colors';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import SubscriptionCard from './components/SubscriptionCard';
import useLogout from '../app/profile/useLogout';
import { useConfig } from '../../context/core';
import { WEBVIEW } from '../../navigation/ScreenNames';
import HeaderIconButton from '../../components/header/HeaderButton';
import InnovativeSvg from '../../../assets/svgs/InnovativeSvg';
import VaultSvg from '../../../assets/svgs/VaultSvg';
import LightningSvg from '../../../assets/svgs/LightningSvg';
import BrushSvg from '../../../assets/svgs/BrushSvg';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';
import Button from '../../components/Button';
import useAuthContext from '../../hooks/auth/useAuthContext';
import ResizedImage from '../../components/ResizedImage';
import Star from '../../../assets/svgs/Star';

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

    const { subscriptionBenefits } = useFeatureFlags();

    const subscriptionBenefitsIconsMap = {
        innovative: InnovativeSvg(),
        vault: VaultSvg(),
        lightning: LightningSvg(),
        brush: BrushSvg(),
    };

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
            if (fromSettings) {
                navigation.goBack();
            }
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
            if (fromSettings) {
                navigation.goBack();
            }
        } catch (er) {
            alert(er.message);
            setSubscribing(false);
            if (fromSettings) {
                navigation.goBack();
            }
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

    const { auth } = useAuthContext();

    const isBrand = auth?.profile?.type === 'brand';

    const appBenefits = isBrand ? subscriptionBenefits?.brandBenefits : subscriptionBenefits?.benefits;
    const reviews = subscriptionBenefits?.reviews

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox selfCenter mt={60}>
                <BrandLogo height={45} width={SCREEN_WIDTH / 1.4} />
            </TemplateBox>
            <TemplateBox
                flex
                backgroundColor={PAYWALL_PRIMARY_BACKGROUND}
                mt={16}
            >
                <TemplateBox selfCenter ph={WRAPPER_MARGIN}>
                    <TemplateText
                        bold
                        size={18}
                        center
                        color={BLACK}
                        lineHeight={22}
                        startCase
                    >
                        {subscriptionBenefits?.title}
                    </TemplateText>
                </TemplateBox>

                <TemplateBox
                    backgroundColor={WHITE}
                    borderRadius={16}
                    mh={WRAPPER_MARGIN}
                    mt={WRAPPER_MARGIN}
                    mb={WRAPPER_MARGIN}
                >
                    {appBenefits?.map((benefit) => (
                        <TemplateBox
                            key={benefit?.title}
                            row
                            alignItems="center"
                            justifyContent="space-between"
                            ph={WRAPPER_MARGIN}
                            pv={WRAPPER_MARGIN}
                            borderBottomWidth={1}
                            borderBottomColor={BLACK_10}
                            width={WRAPPED_SCREEN_WIDTH}
                        >
                            <TemplateBox row alignItems="center">
                                {subscriptionBenefitsIconsMap[benefit?.icon]}
                                <TemplateBox width={10} />
                                <TemplateBox width={WRAPPED_SCREEN_WIDTH - (WRAPPER_MARGIN * 5.5)}>
                                    <TemplateText
                                        size={16}
                                        color={BLACK}
                                        semiBold
                                    >
                                        {benefit?.title}
                                    </TemplateText>
                                    <TemplateText
                                        size={13}
                                        color={BLACK}
                                    >
                                        {benefit?.description}
                                    </TemplateText>
                                </TemplateBox>

                            </TemplateBox>
                        </TemplateBox>

                    ))}
                </TemplateBox>
                <TemplateBox selfCenter>
                        <TemplateText
                            size={14}
                            color={BLACK}
                            medium
                            center
                        >
                            {subscriptionBenefits?.subtitle}
                        </TemplateText>
                    </TemplateBox> 

                <TemplateBox mh={WRAPPER_MARGIN}>
                    {
                        packages?.length ? (
                            packages.map((pack, index) => (
                                <SubscriptionCard
                                    onPress={() => setSelected(index)}
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
                                />
                            ))
                        ) : (
                            <TemplateBox selfCenter alignItems="center" justifyContent="center">
                                <ActivityIndicator color={BLACK} size="small" />
                            </TemplateBox>
                        )
                    }

                </TemplateBox>
                <Button
                    title={subscriptionBenefits?.buttonCta}
                    onPress={() => handleSubscription(selected)}
                    style={styles.button}
                    loading={loading}
                />
                <TemplateBox
                    onPress={onRestore}
                    selfCenter
                    mv={WRAPPER_MARGIN}
                    mh={WRAPPER_MARGIN}
                >
                    <TemplateText color={IOS_BLUE} semiBold size={16}>
                        Restore Subscription
                    </TemplateText>
                </TemplateBox>

                {
                    reviews?.length > 1 && 
                    <TemplateBox selfCenter >
                        <TemplateBox mb={16}>
                            <TemplateText semiBold>
                                Trusted by UGC creators worldwide
                            </TemplateText>
                        </TemplateBox>
                    
                        {reviews?.map(({title, subtitle, image}, index)=> (
                            <TemplateBox key={index} row backgroundColor={WHITE} width={WRAPPED_SCREEN_WIDTH} borderRadius={12} pAll={16} mb={16}>
                                <ResizedImage source={{uri: image}} style={{width: 48, aspectRatio: 1, borderRadius: 12}} />
                            <TemplateBox ml={16} width='75%'>
                                <TemplateText size={16} medium>
                                    {title}
                                </TemplateText>
                                <TemplateText size={14} color={`${DARK_GREY}b3`} mt={4} light>
                                    {subtitle}
                                </TemplateText>

                                <TemplateBox row mt={6}>
                                {
                                    Array(5).fill(0).map((_, index) => (
                                        <Star style={{marginRight: 4}} />
                                    ))
                                }
                                </TemplateBox>
                            </TemplateBox>

                            </TemplateBox>
                        ))}
                    </TemplateBox>
                }

                
                <TemplateBox ph={WRAPPER_MARGIN} mb={WRAPPER_MARGIN}>
                    <TemplateText size={12} color={BLACK_60} center small>
                        By selecting a subscription plan you agree to our
                        {' '}
                        <TemplateText
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
                {!fromSettings && (
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
                )}
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BLACK_10,
    },
    contentContainer: {
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
    },
    button: {
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: IOS_BLUE,
    },
});
export default SubscriptionScreen;
