import React, { useEffect, useState } from 'react';
import {
    StyleSheet, View, FlatList, Alert,
} from 'react-native';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { TRANSPARENT, WHITE } from '../../../theme/Colors';
import { HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateText from '../../../components/TemplateText';
import TemplateBox from '../../../components/TemplateBox';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import { warmReachOutEmail } from '../../../consts/emails/CreatorEmails';
import RecommendedBrandModal from '../../../components/modals/RecommendedBrandModal';
import useMailCompose from '../../../hooks/documents/useMailCompose';
// import useHasSubscription from '../../subscriptions/useHasSubscription';
import BrandsCatalogueCard from './BrandsCatalogueCard';

const BrandsCatalogueScreen = ({ navigation }) => {
    const { brandsCatalogue } = useFeatureFlags();

    const [selectedBrand, setSelectedBrand] = useState();

    const [modalVisible, setModalVisible] = useState(false);

    const [limit, setLimit] = useState(6);

    const title = brandsCatalogue?.title || 'Brands Catalogue';

    const subtitle = brandsCatalogue?.subtitle || 'These brands are looking for creators like you!';

    const { trackEvent } = useTrackEvent();

    const { sendEmailWithAttachment, mailEvent } = useMailCompose();

    useEffect(() => {
        if (mailEvent) {
            setModalVisible(false);
        }
    }, [mailEvent]);

    const renderItem = ({ item }) => (
        <BrandsCatalogueCard
            navigation={navigation}
            item={item}
            setModalVisible={setModalVisible}
            setSelectedBrand={setSelectedBrand}
        />
    );

    const keyExtractor = (item) => item?.['Brand Name'];

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
                    showsVerticalScrollIndicator={false}
                    data={brandsCatalogue?.brands?.slice(0, limit)}
                    getItemLayout={(data, index) => (
                        { length: 5, offset: 5 * index, index }
                    )}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.brandsListContentContainer}
                    onEndReachedThreshold={0}
                    onEndReached={() => { setLimit((prevLimit) => prevLimit + 4); }}
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
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
    brandsListContentContainer: {
        alignSelf: 'center',
    },
});
export default BrandsCatalogueScreen;
