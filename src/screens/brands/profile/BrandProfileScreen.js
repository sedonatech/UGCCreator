import React, { useLayoutEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';

import { BLACK_10, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import {
    DEFAULT_BRAND_DESCRIPTION, DEFAULT_BRAND_SHORT_DESCRIPTION,
    DEFAULT_CREATOR_CONTACT_INFO,
    DEFAULT_CREATOR_PAYPAL_LINK,
    DEFAULT_CREATOR_SOCIAL,
} from '../../../consts/content/Portfolio';
import HeaderIconButton from '../../../components/header/HeaderButton';
import useShareScreenShot from '../../../Utils/useShareScreenShot';
import PortfolioHeader from '../../app/profile/components/PortfolioHeader';
import AboutSection from '../../app/profile/components/AboutSection';
import ContactSection from '../../app/profile/components/ContactSection';

const BrandProfileScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const brand = auth?.profile;

    const userName = brand?.name;

    const image = brand?.image;

    const about = brand?.description || DEFAULT_BRAND_DESCRIPTION;

    const shortDescription = brand?.shortDescription
        || DEFAULT_BRAND_SHORT_DESCRIPTION;

    const contact = brand?.contact || DEFAULT_CREATOR_CONTACT_INFO;

    const email = brand?.email;

    const socials = brand?.socialMedia || DEFAULT_CREATOR_SOCIAL;

    const paypalLink = brand?.paypalLink || DEFAULT_CREATOR_PAYPAL_LINK;

    const location = brand?.location?.country || 'London';

    const screenshot = useRef(null);

    const [shareScreenshot] = useShareScreenShot(userName, screenshot);

    const handleShare = async () => {
        await shareScreenshot();
    };

    useLayoutEffect(() => {
        if (!brand?.id) {
            navigation.setOptions({
                headerLeft: () => (
                    <HeaderIconButton
                        name="share-outline"
                        onPress={handleShare}
                        backDropColor={BLACK_10}
                        ml={WRAPPER_MARGIN}
                    />
                ),
            });
        }
    }, [navigation, brand?.id]);

    return (
        <ViewShot style={styles.viewShot} ref={screenshot}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >

                <PortfolioHeader
                    userName={userName}
                    location={location}
                    creatorId={brand?.id}
                    image={image}
                />
                <AboutSection
                    about={about}
                    shortDescription={shortDescription}
                />
                <ContactSection
                    contactInfo={contact}
                    socials={socials}
                    paypalLink={paypalLink}
                    email={email}
                />
            </ScrollView>
        </ViewShot>
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
    viewShot: {
        flex: 1,
    },
});
export default BrandProfileScreen;
