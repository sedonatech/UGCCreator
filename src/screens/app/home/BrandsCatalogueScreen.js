import React, { useEffect, useState } from 'react';
import {
    StyleSheet, View, FlatList, Alert,
} from 'react-native';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { WHITE } from '../../../theme/Colors';
import {
    HEADER_MARGIN,
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
import { warmReachOutEmail } from '../../../consts/emails/CreatorEmails';
import RecommendedBrandModal from '../../../components/modals/RecommendedBrandModal';
import useMailCompose from '../../../hooks/documents/useMailCompose';
import useHasSubscription from '../../subscriptions/useHasSubscription';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const BrandsCatalogueScreen = ({ navigation }) => {
    const { brandsCatalogue, features } = useFeatureFlags();

    const { auth } = useAuthContext();

    const userEmail = auth?.user?.email;

    // TODO: Investigate why this is not working
    const { purchaserInfo, hasSubscription } = useHasSubscription();

    const hasActiveSubscription = purchaserInfo?.activeSubscriptions?.length > 0;

    const [selectedBrand, setSelectedBrand] = useState();

    const [modalVisible, setModalVisible] = useState(false);

    const { unlockedUsers, activeList: activeCatalogueList } = features?.brandsCatalogue;

    // Check if the  user's  email is in the unlockedUsers list
    const isUnlockedUser = unlockedUsers?.includes(userEmail);

    const title = brandsCatalogue?.title || 'Brands Catalogue';

    const subtitle = brandsCatalogue?.subtitle || 'These brands are looking for creators like you!';

    const { trackEvent } = useTrackEvent();

    const { sendEmailWithAttachment, mailEvent } = useMailCompose();

    useEffect(() => {
        if (mailEvent) {
            setModalVisible(false);
        }
    }, [mailEvent]);

    return (
        <View
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox
                mt={HEADER_MARGIN}
            >
                <TemplateBox
                    selfCenter
                    alignItems="center"
                    justifyContent="center"
                    ph={WRAPPER_MARGIN}
                >
                    <TemplateText
                        size={18}
                        bold
                        startCase
                        center
                    >
                        {title}
                    </TemplateText>
                    <TemplateBox height={5} />
                    <TemplateText
                        size={14}
                        startCase
                        center
                    >
                        {subtitle}
                    </TemplateText>
                </TemplateBox>

                <FlatList
                    data={brandsCatalogue?.brands}
                    renderItem={({ item, index }) => {
                        const isActive = index <= activeCatalogueList;
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
                    }}
                    keyExtractor={(item) => item?.['Brand Name']}
                    contentContainerStyle={styles.brandsListContentContainer}
                />
            </TemplateBox>
            <RecommendedBrandModal
                visible={modalVisible}
                title={selectedBrand?.['Brand Name']}
                subtitle={selectedBrand?.['Mail Address']}
                secondaryButtonTitle="Reach Out to Brand"
                height="30%"
                onClose={() => {
                    setModalVisible(false);
                }}
                onSecondaryButtonPress={() => {
                    Alert.alert('Reach Out to Brand',
                        `Send an email to ${selectedBrand?.['Brand Name']} to invite them to collaborate with you on this platform. You'll be notified when they accept your request`, [
                            {
                                text: 'OK',
                                onPress: () => {
                                    sendEmailWithAttachment({
                                        recipients: [selectedBrand?.['Mail Address']],
                                        subject: warmReachOutEmail.subject,
                                        body: warmReachOutEmail.body,
                                    });
                                    trackEvent('message_sent_to_brand_from_catalogue', {
                                        brand: selectedBrand?.['Brand Name'],
                                    });
                                },
                            },
                        ]);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
    brandsListContentContainer: {
        alignSelf: 'center',
    },
});
export default BrandsCatalogueScreen;
