import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import {
    BLACK, IOS_BLUE, LIGHT_PURPLE,
} from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import { BRANDS_CATALOGUE } from '../../../../navigation/ScreenNames';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../../Utils/getResponsiveSize';
import {
    ELEVATION,
    SHADOW_OFFSET_HEIGHT,
    SHADOW_OFFSET_WIDTH,
} from '../../../../theme/Shadow';
import useMailCompose from '../../../../hooks/documents/useMailCompose';
import useTrackEvent from '../../../../hooks/events/useTrackEvent';
import { warmReachOutEmail } from '../../../../consts/emails/CreatorEmails';
import RecommendedBrandModal from '../../../../components/modals/RecommendedBrandModal';

const EmergingBrandsCarousel = ({ style }) => {
    const navigation = useNavigation();
    const { brandsCatalogue } = useFeatureFlags();

    const { trackEvent } = useTrackEvent();

    // get the first four brands to display with a useMemo
    const firstFourBrands = useMemo(() => {
        if (!brandsCatalogue?.brands) return [];

        return brandsCatalogue?.brands.slice(0, 20);
    }, [brandsCatalogue?.brands]);

    const [selectedBrand, setSelectedBrand] = useState();

    const [modalVisible, setModalVisible] = useState(false);

    const { sendEmailWithAttachment, mailEvent } = useMailCompose();

    useEffect(() => {
        if (mailEvent) {
            setModalVisible(false);
        }
    }, [mailEvent]);

    return (
        <>

            <TemplateBox style={style}>
                {brandsCatalogue && (
                    <TemplateBox>
                        <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={16}>
                            <TemplateBox width={SCREEN_WIDTH * 0.8}>
                                <TemplateText
                                    size={16}
                                    semiBold
                                >
                                    {brandsCatalogue?.title || 'Emerging Brands'}
                                </TemplateText>

                            </TemplateBox>
                            <TemplateBox flex />
                            <TemplateTouchable
                                onPress={() => navigation.navigate(BRANDS_CATALOGUE)}
                            >
                                <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                                    See All
                                </TemplateText>
                            </TemplateTouchable>
                        </TemplateBox>

                        <TemplateText
                            size={13}
                            color={BLACK}
                            style={styles.subtitle}
                        >
                            {brandsCatalogue?.subtitle || 'These brands are looking for creators like you!'}
                        </TemplateText>
                    </TemplateBox>
                )}
                <TemplateCarousel
                    data={firstFourBrands}
                    renderItem={({ item }) => (
                        <TemplateBox
                            borderRadius={wp(16)}
                            pAll={wp(16)}
                            onPress={() => {
                                setSelectedBrand(item);
                                setTimeout(() => {
                                    setModalVisible(true);
                                }, 100);
                            }}
                            style={styles.card}
                            width={SCREEN_WIDTH / 1.6}
                            height={wp(110)}
                            center
                            mr={wp(16)}
                            mt={wp(8)}
                        >
                            <TemplateText
                                startCase
                                size={wp(16)}
                                semiBold
                            >
                                {item['Brand Name']}
                            </TemplateText>
                            <TemplateBox height={wp(8)} />
                            <TemplateText
                                size={wp(12)}

                            >
                                {item?.Caption}

                            </TemplateText>
                        </TemplateBox>
                    )}
                    contentContainerStyle={styles.cardCarousel}
                    snapToInterval={SCREEN_WIDTH / 1.6}
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
                    setSelectedBrand(null);
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
        </>
    );
};

const styles = StyleSheet.create({
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    subtitle: {
        marginLeft: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    card: {
        shadowOffset: {
            width: SHADOW_OFFSET_WIDTH,
            height: SHADOW_OFFSET_HEIGHT,
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: ELEVATION,
        backgroundColor: LIGHT_PURPLE,
    },
});

EmergingBrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

EmergingBrandsCarousel.defaultProps = {
    style: {},
};
export default EmergingBrandsCarousel;
