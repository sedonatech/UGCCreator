import React, { useLayoutEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';

import { BLACK_10, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import PortfolioHeader from './components/PortfolioHeader';
import AboutSection from './components/AboutSection';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import {
    DEFAULT_CREATOR_CONTACT_INFO,
    DEFAULT_CREATOR_DESCRIPTION, DEFAULT_CREATOR_PAYPAL_LINK, DEFAULT_CREATOR_RATES,
    DEFAULT_CREATOR_SOCIAL,
} from '../../../consts/content/Portfolio';
import ContactSection from './components/ContactSection';
import SampleWorkSection from './components/SampleWorkSection';
import RatesSection from './components/RatesSection';
import HeaderIconButton from '../../../components/header/HeaderButton';
import useShareScreenShot from '../../../Utils/useShareScreenShot';

const PortfolioScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const userName = auth?.profile?.userName;
    const about = auth?.profile?.about || DEFAULT_CREATOR_DESCRIPTION;
    const contact = DEFAULT_CREATOR_CONTACT_INFO;
    const socials = auth?.profile?.socials || DEFAULT_CREATOR_SOCIAL;
    const paypalLink = auth?.profile?.paypalLink || DEFAULT_CREATOR_PAYPAL_LINK;
    const location = auth?.profile?.location?.city || 'London';
    const rates = DEFAULT_CREATOR_RATES;

    const screenshot = useRef(null);

    const [shareScreenshot] = useShareScreenShot(userName, screenshot);

    const handleShare = async () => {
        await shareScreenshot();
    };

    useLayoutEffect(() => {
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
    }, [navigation]);

    return (
        <ViewShot style={styles.viewShot} ref={screenshot}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >

                <PortfolioHeader userName={userName} location={location} />
                <AboutSection about={about} />
                <SampleWorkSection />
                <RatesSection rates={rates} />
                <ContactSection
                    contactInfo={contact}
                    socials={socials}
                    paypalLink={paypalLink}
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
export default PortfolioScreen;
