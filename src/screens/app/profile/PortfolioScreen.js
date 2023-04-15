import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import ViewShot from 'react-native-view-shot';

import { BLACK_10, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import PortfolioHeader from './components/PortfolioHeader';
import AboutSection from './components/AboutSection';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import {
    DEFAULT_CREATOR_CONTACT_INFO,
    DEFAULT_CREATOR_DESCRIPTION,
    DEFAULT_CREATOR_PAYPAL_LINK,
    DEFAULT_CREATOR_RATES,
    DEFAULT_CREATOR_SHORT_DESCRIPTION,
    DEFAULT_CREATOR_SOCIAL,
} from '../../../consts/content/Portfolio';
import ContactSection from './components/ContactSection';
import SampleWorkSection from './components/SampleWorkSection';
import RatesSection from './components/RatesSection';
import HeaderIconButton from '../../../components/header/HeaderButton';
import useShareScreenShot from '../../../Utils/useShareScreenShot';
import useGetCreators from '../../../hooks/brands/useGetCreators';
import TemplateBox from '../../../components/TemplateBox';
import Button from '../../../components/Button';

const PortfolioScreen = ({ navigation, route }) => {
    const creatorId = route?.params?.creatorId;

    const { creators } = useGetCreators();

    const selectedCreator = useMemo(() => {
        if (!creators || !creatorId) return null;

        return creators?.find(({ id }) => id === creatorId);
    }, [
        creators,
        creatorId,
    ]);

    const { auth } = useAuthContext();

    const creator = selectedCreator || auth?.profile;

    const userName = creator?.userName;
    const image = creator?.image;
    const portfolioLink = creator?.portfolioLink;
    const about = creator?.about || DEFAULT_CREATOR_DESCRIPTION;
    const shortDescription = creator?.shortDescription
      || DEFAULT_CREATOR_SHORT_DESCRIPTION;
    const contact = creator?.contact || DEFAULT_CREATOR_CONTACT_INFO;
    const socials = creator?.socials || DEFAULT_CREATOR_SOCIAL;
    const paypalLink = creator?.paypalLink || DEFAULT_CREATOR_PAYPAL_LINK;
    const location = creator?.location?.country || 'London';
    const rates = creator?.rates || DEFAULT_CREATOR_RATES;
    const email = creator?.email;

    const screenshot = useRef(null);

    const [shareScreenshot] = useShareScreenShot(userName, screenshot);

    const handleShare = async () => {
        await shareScreenshot();
    };

    useLayoutEffect(() => {
        if (!creatorId) {
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
    }, [navigation, creatorId]);

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
                    creatorId={creatorId}
                    image={image}
                />
                <AboutSection
                    about={about}
                    shortDescription={shortDescription}
                    portfolioLink={portfolioLink}
                />
                <SampleWorkSection />
                <RatesSection rates={rates} />
                <ContactSection
                    contactInfo={contact}
                    socials={socials}
                    paypalLink={paypalLink}
                    email={email}
                />
                {
                    creatorId
                  && creator?.email
                  && (
                      <TemplateBox selfCenter mv={WRAPPER_MARGIN}>
                          <Button
                              title="Contact Creator"
                              onPress={async () => {
                                  try {
                                      await Linking.openURL(`mailto:${creator?.email}`);
                                  } catch (e) {
                                      console.log('-> e', e);
                                  }
                              }}
                          />
                      </TemplateBox>
                  )
                }
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
