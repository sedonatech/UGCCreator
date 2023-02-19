import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID } from '../../../theme/Layout';

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

const PortfolioScreen = () => {
    const { auth } = useAuthContext();

    const userName = auth?.profile?.userName;
    const about = auth?.profile?.about || DEFAULT_CREATOR_DESCRIPTION;
    const contact = DEFAULT_CREATOR_CONTACT_INFO;
    const socials = auth?.profile?.socials || DEFAULT_CREATOR_SOCIAL;
    const paypalLink = auth?.profile?.paypalLink || DEFAULT_CREATOR_PAYPAL_LINK;
    const location = auth?.profile?.location?.city || 'London';
    const rates = DEFAULT_CREATOR_RATES;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
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
});
export default PortfolioScreen;
