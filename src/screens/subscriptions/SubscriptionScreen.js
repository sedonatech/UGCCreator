/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TemplateText from '../../components/TemplateText';
import useSubscriptionContext from './useSubscriptionContext';
import useRestorePurchases from './useRestorePurchases';
import usePurchase from './usePurchase';
import useAvailablePackages from './useAvailablePackages';
import TemplateBox from '../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import {
    ACCENT,
    BLACK,
    BLACK_10,
    BLACK_60,
    BLACK_70,
    IOS_BLUE,
    RED,
    SUBSCRIPTION_BG,
    SUBSCRIPTION_BLUE,
    SUBSCRIPTION_DARK,
    WHITE,
    WHITE_10,
    WHITE_20,
    WHITE_60,
    WHITE_70,
    WHITE_80,
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
import useLocalizedSubscriptionBenefits from '../../hooks/featureFlags/useLocalizedSubscriptionBenefits';
import Button from '../../components/Button';
import useAuthContext from '../../hooks/auth/useAuthContext';
import ResizedImage from '../../components/ResizedImage';
import Star from '../../../assets/svgs/Star';
import useTranslation from '../../hooks/useTranslation';

const SubscriptionScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const fromSettings = route?.params?.fromSettings;
    const subscription = useSubscriptionContext();
    const { logout: handleLogout } = useLogout();
    const { mainDomain } = useConfig();
    const [loading, setLoading] = useState(false);
    const [subscribing, setSubscribing] = useState(null);
    const [selected, setSelectedPackage] = useState(null);
    const [error, setError] = useState(null);
    const restorePurchases = useRestorePurchases();
    const [packages, originalPackages] = useAvailablePackages(subscription?.purchase);
    const purchase = usePurchase();

    const subscriptionBenefits = useLocalizedSubscriptionBenefits();

    const subscriptionBenefitsIconsMap = {
        innovative: InnovativeSvg(),
        vault: VaultSvg(),
        lightning: LightningSvg(),
        brush: BrushSvg(),
    };

    useEffect(() => {
        if (!packages?.length) return;

        const recommendedIndex = packages.findIndex(pack => pack?.recommended);

        setSelectedPackage(currentSelected => {
            if (typeof currentSelected === 'number' && packages[currentSelected]) {
                return currentSelected;
            }

            return recommendedIndex >= 0 ? recommendedIndex : 0;
        });
    }, [packages]);

    const onSubscribe = async i => {
        setLoading(true);
        if (error) setError(null);
        let index = selected;
        if (typeof i === 'number') {
            index = i;
        }
        try {
            const availablePackage = originalPackages[index];
            if (index === null || !availablePackage) {
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
        } finally {
            setLoading(false);
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
        } finally {
            setLoading(false);
        }
    };

    const setSelected = item => {
        if (typeof item !== 'number') {
            console.error(
                '[SubscriptionScreenInjector] - onSelectPackage error: Incorrect data passed, only value of type int is allowed',
            );
            return;
        }
        setError(null);
        setSelectedPackage(item);
    };

    const handleSubscription = async index => {
        try {
            setSelected(index);
            setSubscribing(index);
            const purchaseCompleted = await onSubscribe(index);
            setSubscribing(null);
            if (purchaseCompleted && fromSettings) {
                navigation.goBack();
            }
        } catch (er) {
            console.log('handleSubscription error:', er);
            setSubscribing(null);
        }
    };

    const getSavings = pack => {
        if (!packages?.length) return null;

        const monthlyPackage = packages.find(({ identifier }) => identifier?.includes('monthly'));

        const monthlyBasePrice = Number(monthlyPackage?.price);
        if (!Number.isFinite(monthlyBasePrice) || monthlyBasePrice <= 0) {
            return null;
        }

        const fullMonthlyPrice = monthlyBasePrice * 12;

        const packBasePrice = Number(pack?.price);
        if (!Number.isFinite(packBasePrice) || packBasePrice <= 0) {
            return null;
        }

        const isQuarterly = pack?.identifier?.includes('quarterly');
        const packAnnualEquivalent = packBasePrice * (isQuarterly ? 4 : 1);

        const saving = Math.round(100 - (packAnnualEquivalent / fullMonthlyPrice) * 100);

        if (!Number.isFinite(saving) || saving <= 0) {
            return null;
        }

        return `${saving}%`;
    };

    useLayoutEffect(() => {
        if (fromSettings) {
            navigation.setOptions({
                headerLeft: () => (
                    <HeaderIconButton
                        name="chevron-back-outline"
                        onPress={() => navigation.goBack()}
                        backDropColor={WHITE_10}
                        ml={WRAPPER_MARGIN}
                    />
                ),
            });
        }
    }, [fromSettings, navigation]);

    const { auth } = useAuthContext();

    const isBrand = auth?.profile?.type === 'brand';

    const appBenefits = isBrand ? subscriptionBenefits?.brandBenefits : subscriptionBenefits?.benefits;
    const reviews = subscriptionBenefits?.reviews;
    const selectedPackage = typeof selected === 'number' ? packages?.[selected] : null;
    const selectedSummary = selectedPackage?.introPrice
        ? t('subscriptions.screen.todayThenSummary', {
            introPrice: selectedPackage?.introPrice,
            nextCharge: selectedPackage?.billed || selectedPackage?.priceString,
        })
        : selectedPackage?.billed || selectedPackage?.priceString;

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        >
            <StatusBar  barStyle='light-content' />
            <LinearGradient colors={[BLACK, SUBSCRIPTION_DARK, SUBSCRIPTION_BLUE]} style={styles.hero}>
                <View style={styles.heroOrbPrimary} />
                <View style={styles.heroOrbSecondary} />

                <TemplateBox ph={WRAPPER_MARGIN} pt={fromSettings ? 24 : 56} pb={36}>
                    <TemplateBox flex center>
                        <BrandLogo height={44} width={SCREEN_WIDTH / 1.55} color={WHITE} />
                    </TemplateBox>

                    <TemplateText size={31} bold color={WHITE} lineHeight={36} mt={18}>
                        {subscriptionBenefits?.title}
                    </TemplateText>

                    <TemplateText size={16} color={WHITE_80} lineHeight={24} mt={12}>
                        {subscriptionBenefits?.subtitle}
                    </TemplateText>
                </TemplateBox>
            </LinearGradient>

            <TemplateBox ph={WRAPPER_MARGIN} mt={-20}>
                <TemplateBox style={styles.sectionCard}>
                    <TemplateText size={22} bold color={BLACK}>
                        {t('subscriptions.screen.unlockSectionTitle')}
                    </TemplateText>

                    {appBenefits?.map((benefit, index) => (
                        <TemplateBox
                            key={benefit?.title}
                            row
                            alignItems="center"
                            style={[
                                styles.benefitRow,
                                index === appBenefits.length - 1 ? styles.benefitRowLast : null,
                            ]}
                        >
                            <TemplateBox style={styles.benefitIconWrap}>
                                {subscriptionBenefitsIconsMap[benefit?.icon]}
                            </TemplateBox>

                            <TemplateBox flex ml={14}>
                                <TemplateText size={16} color={BLACK} semiBold>
                                    {benefit?.title}
                                </TemplateText>
                                <TemplateText size={13} color={BLACK_70} lineHeight={18} mt={4}>
                                    {benefit?.description}
                                </TemplateText>
                            </TemplateBox>

                            <TemplateBox style={styles.benefitIndex}>
                                <TemplateText size={12} color={BLACK_60} semiBold>
                                    0{index + 1}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    ))}
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mt={20}>
                <TemplateText size={22} bold color={WHITE}>
                    {t('subscriptions.screen.plansSectionTitle')}
                </TemplateText>
                <TemplateText size={14} color={WHITE_70} lineHeight={20} mt={8}>
                    {t('subscriptions.screen.plansSectionSubtitle')}
                </TemplateText>
            </TemplateBox>

            <TemplateBox mh={WRAPPER_MARGIN} mt={18}>
                {packages?.length ? (
                    packages.map((pack, index) => (
                        <SubscriptionCard
                            onPress={() => setSelected(index)}
                            key={pack?.label}
                            title={pack?.label}
                            price={pack?.priceString}
                            description={pack?.description}
                            selected={selected === index}
                            index={index}
                            isSale
                            savingPercent={pack?.showSaving && getSavings(pack)}
                            introPrice={pack?.introPrice || pack?.introDiscountPrice}
                            billed={pack?.billed}
                            originalPrice={pack?.originalPrice}
                            freeTrial={pack?.freeTrial}
                            recommended={pack?.recommended}
                            recommendedCopy={pack?.recommendedCopy}
                            popularCopy={pack?.popularCopy}
                        />
                    ))
                ) : (
                    <TemplateBox style={styles.loadingCard}>
                        <ActivityIndicator color={WHITE} size="small" />
                    </TemplateBox>
                )}
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mt={20}>
                <TemplateBox style={styles.checkoutCard}>
                    <TemplateBox row alignItems="center" flexWrap='wrap' >
                        <TemplateText size={18} bold color={BLACK}>
                            {t('subscriptions.screen.checkoutTitle')}
                        </TemplateText>
                        {!!selectedPackage?.recommended && (
                            <TemplateBox backgroundColor={ACCENT} borderRadius={999} pv={5} ph={10} >
                                <TemplateText size={11} color={BLACK} bold caps>
                                    {t('subscriptions.screen.bestValueBadge')}
                                </TemplateText>
                            </TemplateBox>
                        )}

                        <TemplateText size={14} color={BLACK_70} lineHeight={20} mt={10} ml={8}>
                            {selectedSummary || t('subscriptions.screen.selectPlanFallback')}
                         </TemplateText>
                    </TemplateBox>

                    

                    {!!error && (
                        <TemplateText size={13} color={RED} mt={12}>
                            {t('subscriptions.screen.checkoutError')}
                        </TemplateText>
                    )}

                    <Button
                        title={subscriptionBenefits?.buttonCta}
                        onPress={() => handleSubscription(selected)}
                        style={styles.button}
                        loading={loading || (typeof selected === 'number' && subscribing === selected)}
                        disabled={!selectedPackage}
                        height={54}
                        width={SCREEN_WIDTH - WRAPPER_MARGIN * 4}
                        color={BLACK}
                    />

                    <TemplateBox onPress={onRestore} selfCenter mt={16}>
                        <TemplateText color={IOS_BLUE} semiBold size={16}>
                            {t('subscriptions.restoreButton')}
                        </TemplateText>
                    </TemplateBox>

                    <TemplateText size={12} color={BLACK_60} center lineHeight={18} mt={16}>
                        {t('subscriptions.screen.checkoutFooter')}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            {reviews?.length ? (
                <TemplateBox ph={WRAPPER_MARGIN} mt={28}>
                    <TemplateText size={22} bold color={WHITE}>
                        {t('subscriptions.trustBadge')}
                    </TemplateText>

                    {reviews?.map(({ title, subtitle, image }, index) => (
                        <TemplateBox key={index} style={styles.reviewCard}>
                            <ResizedImage
                                source={{ uri: image }}
                                style={{ width: 52, aspectRatio: 1, borderRadius: 14 }}
                            />

                            <TemplateBox flex ml={16}>
                                <TemplateBox row alignItems="center" justifyContent="space-between">
                                    <TemplateBox flex mr={12}>
                                        <TemplateText size={16} color={WHITE} semiBold>
                                            {title}
                                        </TemplateText>
                                    </TemplateBox>
                                    <TemplateBox row>
                                        {Array(5)
                                            .fill(0)
                                            .map((_, indx) => (
                                                <Star key={`star-${index}-${indx}`} style={{ marginLeft: 2 }} />
                                            ))}
                                    </TemplateBox>
                                </TemplateBox>

                                <TemplateText size={13} color={WHITE_70} lineHeight={19} mt={8}>
                                    {subtitle}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    ))}
                </TemplateBox>
            ) : null}

            <TemplateBox ph={WRAPPER_MARGIN} mt={28}>
                <TemplateBox style={styles.legalCard}>
                    <TemplateText size={12} color={WHITE_60} center lineHeight={18}>
                        {t('subscriptions.termsPrefix')}{' '}
                        <TemplateText
                            color={WHITE}
                            size={13}
                            underLine
                            onPress={() => {
                                if (mainDomain) {
                                    navigation.navigate(WEBVIEW, {
                                        url: mainDomain,
                                    });
                                }
                            }}
                        >
                            {t('subscriptions.termsLink')}
                        </TemplateText>
                        <TemplateText color={WHITE} center size={13}>
                            {' '}
                            {t('subscriptions.and')}{' '}
                        </TemplateText>
                        <TemplateText
                            color={WHITE}
                            size={13}
                            underLine
                            onPress={() => {
                                if (mainDomain) {
                                    navigation.navigate(WEBVIEW, {
                                        url: mainDomain,
                                    });
                                }
                            }}
                        >
                            {t('subscriptions.privacyLink')}{' '}
                        </TemplateText>
                        {t('subscriptions.autoRenewText')}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            {!fromSettings && (
                <TemplateBox selfCenter mt={24} mb={WRAPPER_MARGIN * 2} onPress={() => handleLogout()}>
                    <TemplateText caps color={IOS_BLUE} semiBold size={12} underLine>
                        {t('subscriptions.logout')}
                    </TemplateText>
                </TemplateBox>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BLACK,
    },
    contentContainer: {
        paddingBottom: 12,
    },
    hero: {
        overflow: 'hidden',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    heroOrbPrimary: {
        position: 'absolute',
        right: -50,
        top: 32,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
    },
    heroOrbSecondary: {
        position: 'absolute',
        left: -70,
        bottom: 50,
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: 'rgba(165, 196, 253, 0.16)',
    },
    heroPanel: {
        marginTop: 24,
        backgroundColor: WHITE,
        borderRadius: 28,
        padding: 20,
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 10,
    },
    metricCard: {
        flex: 1,
        backgroundColor: BLACK_10,
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    sectionCard: {
        backgroundColor: WHITE,
        borderRadius: 28,
        padding: 20,
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    benefitRow: {
        marginTop: 18,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: BLACK_10,
    },
    benefitRowLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    benefitIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BLACK_10,
    },
    benefitIndex: {
        minWidth: 34,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 8,
        borderRadius: 999,
        backgroundColor: BLACK_10,
        marginLeft: 12,
    },
    loadingCard: {
        width: WRAPPED_SCREEN_WIDTH,
        borderRadius: 24,
        paddingVertical: 26,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: WHITE_10,
        borderWidth: 1,
        borderColor: WHITE_20,
    },
    checkoutCard: {
        backgroundColor: WHITE,
        borderRadius: 28,
        padding: 20,
    },
    button: {
        marginTop: 18,
        alignSelf: 'center',
        borderRadius: 26,
    },
    reviewCard: {
        flexDirection: 'row',
        width: WRAPPED_SCREEN_WIDTH,
        borderRadius: 22,
        padding: 18,
        marginTop: 16,
        backgroundColor: SUBSCRIPTION_BG,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    legalCard: {
        borderRadius: 22,
        padding: 18,
    },
});

export default SubscriptionScreen;
