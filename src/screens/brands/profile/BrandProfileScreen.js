import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { BLACK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID } from '../../../theme/Layout';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import {
    DEFAULT_BRAND_DESCRIPTION,
    DEFAULT_BRAND_SHORT_DESCRIPTION,
    DEFAULT_CREATOR_CONTACT_INFO,
    DEFAULT_CREATOR_PAYPAL_LINK,
    DEFAULT_CREATOR_SOCIAL,
} from '../../../consts/content/Portfolio';
import PortfolioHeader from '../../app/profile/components/PortfolioHeader';
import AboutSection from '../../app/profile/components/AboutSection';
import ContactSection from '../../app/profile/components/ContactSection';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateIcon from '../../../components/TemplateIcon';
import { UPDATE_BRAND_PROFILE } from '../../../navigation/ScreenNames';
import useTranslation from '../../../hooks/useTranslation';

const BrandProfileScreen = ({ navigation }) => {
    const { auth } = useAuthContext();
    const { t } = useTranslation();

    const brand = auth?.profile;

    const userName = brand?.name;

    const image = brand?.image;

    const about = brand?.description || DEFAULT_BRAND_DESCRIPTION;

    const shortDescription = brand?.shortDescription || DEFAULT_BRAND_SHORT_DESCRIPTION;

    const contact = brand?.contact || DEFAULT_CREATOR_CONTACT_INFO;

    const email = brand?.email;

    const socials = brand?.socialMedia || DEFAULT_CREATOR_SOCIAL;

    const paypalLink = brand?.paypalLink || DEFAULT_CREATOR_PAYPAL_LINK;

    const location = brand?.location?.country || 'London';

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <PortfolioHeader userName={userName} location={location} creatorId={brand?.id} image={image} />

            {/* Edit Profile Button */}
            <TemplateBox selfCenter mt={16} mb={8}>
                <TemplateBox
                    row
                    center
                    onPress={() => navigation.navigate(UPDATE_BRAND_PROFILE)}
                    backgroundColor={BLACK}
                    borderRadius={12}
                    ph={24}
                    pv={12}
                >
                    <TemplateIcon name="create-outline" size={18} family="Ionicons" color={WHITE} />
                    <TemplateText color={WHITE} bold size={14} style={styles.editButtonText}>
                        {t('profile.portfolio.editProfile') || 'Edit Profile'}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <AboutSection about={about} shortDescription={shortDescription} />
            <ContactSection contactInfo={contact} socials={socials} paypalLink={paypalLink} email={email} />
        </ScrollView>
    );
};

BrandProfileScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
    editButtonText: {
        marginLeft: 8,
    },
});
export default BrandProfileScreen;
