/* eslint-disable react/no-unstable-nested-components */
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

import { BLACK, BLACK_40, GREY_SECONDARY, TRANSPARENT, WHITE } from '../../../theme/Colors';
import { IS_ANDROID, SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import PortfolioHeader from './components/PortfolioHeader';
import TemplateTextInput from '../../../components/TemplateTextInput';
import TemplateText from '../../../components/TemplateText';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import HeaderIconButton from '../../../components/header/HeaderButton';
import Wrapper from '../../../components/Wrapper';
import { PROFILE } from '../../../navigation/ScreenNames';
import UpdateCategories from './components/UpdateCategories';
import LoadingOverlay from '../../../components/LoadingOverlay';
import UpdateBrandsWorkedWith from './components/UpdateBrandsWorkedWith';
import UpdateWorkExamples from './components/UpdateWorkExamples';
import UpdateRates from './components/UpdateRates';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import useTranslation from '../../../hooks/useTranslation';

const UpdatePortfolioScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [countryPickerVisible, setCountryPickerVisible] = useState(false);

    const { auth } = useAuthContext();

    const { profile: profileData, update, updateProfile, loading } = auth;

    const { trackEvent } = useTrackEvent();

    const handleUpdate = () => {
        try {
            setTimeout(async () => {
                await updateProfile(profileData, profileData?.id);
                await trackEvent('update_profile');
                navigation.navigate(PROFILE);
            }, 3000);
        } catch (e) {
            console.log(e);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={GREY_SECONDARY}
                    ml={WRAPPER_MARGIN}
                />
            ),
            headerRight: () => (
                <HeaderIconButton
                    title={t('profile.updatePortfolio.saveButton')}
                    onPress={handleUpdate}
                    backDropColor={GREY_SECONDARY}
                    mr={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

    return (
        <>
            <Wrapper contentContainerStyle={styles.contentContainer} style={styles.container} keyboard safe={false}>
                <PortfolioHeader isUpdate />
                <TemplateBox height={WRAPPER_MARGIN} />
                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.userName.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.userName.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.userName}
                        onChangeText={text => update('userName', text)}
                        autoCapitalize="none"
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.email.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.email.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.email}
                        onChangeText={text => update('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.phoneNumber.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.phoneNumber.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.contact?.phoneNumber}
                        onChangeText={text =>
                            update('contact', {
                                phoneNumber: text,
                                email: profileData?.contact?.email,
                            })
                        }
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.shortDescription.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.shortDescription.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.shortDescription}
                        onChangeText={text => update('shortDescription', text)}
                        autoCapitalize="none"
                        multiline
                        numberOfLines={6}
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.description.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.description.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.description}
                        onChangeText={text => update('description', text)}
                        autoCapitalize="none"
                        multiline
                        numberOfLines={26}
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.portfolioLink.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.portfolioLink.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.portfolioLink}
                        onChangeText={text => update('portfolioLink', text)}
                        autoCapitalize="none"
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.instagram.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.instagram.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.socialMedia?.instagram}
                        onChangeText={text =>
                            update('socialMedia', {
                                instagram: text,
                                facebook: profileData?.socialMedia?.facebook || '',
                                twitter: profileData?.socialMedia?.twitter || '',
                                linkedin: profileData?.socialMedia?.linkedin || '',
                            })
                        }
                        autoCapitalize="none"
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.facebook.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.facebook.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.socialMedia?.facebook}
                        onChangeText={text =>
                            update('socialMedia', {
                                instagram: profileData?.socialMedia?.instagram || '',
                                facebook: text,
                                twitter: profileData?.socialMedia?.twitter || '',
                                linkedin: profileData?.socialMedia?.linkedin || '',
                            })
                        }
                        autoCapitalize="none"
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.twitter.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.twitter.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.socialMedia?.twitter}
                        onChangeText={text =>
                            update('socialMedia', {
                                instagram: profileData?.socialMedia?.instagram || '',
                                facebook: profileData?.socialMedia?.facebook || '',
                                twitter: text,
                                linkedin: profileData?.socialMedia?.linkedin || '',
                            })
                        }
                        autoCapitalize="none"
                    />
                </TemplateBox>

                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.linkedin.label')}
                    </TemplateText>
                    <TemplateTextInput
                        placeholder={t('profile.updatePortfolio.fields.linkedin.placeholder')}
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={profileData?.socialMedia?.linkedin}
                        onChangeText={text =>
                            update('socialMedia', {
                                instagram: profileData?.socialMedia?.instagram || '',
                                facebook: profileData?.socialMedia?.facebook || '',
                                twitter: profileData?.socialMedia?.twitter || '',
                                linkedin: text,
                            })
                        }
                        autoCapitalize="none"
                    />
                </TemplateBox>
                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16} bold>
                        {t('profile.updatePortfolio.fields.location.label')}
                    </TemplateText>
                    <TemplateBox
                        row
                        alignItems="center"
                        justifyContent="space-between"
                        pAll={16}
                        mt={10}
                        borderWidth={1}
                        borderColor={GREY_SECONDARY}
                        borderRadius={10}
                        height={60}
                        width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                        onPress={() => setCountryPickerVisible(true)}
                    >
                        <TemplateText color={BLACK_40} size={16}>
                            {profileData?.location?.country || t('profile.updatePortfolio.fields.location.placeholder')}
                        </TemplateText>
                        <TemplateBox flex />
                        <CountryPicker
                            visible={countryPickerVisible}
                            withFilter
                            withFlag
                            withCountryNameButton
                            withAlphaFilter
                            withCallingCode
                            withCallingCodeButton
                            withEmoji
                            countryCode={profileData?.location?.country?.name}
                            onSelect={country => {
                                update('location', {
                                    city: profileData?.location?.city,
                                    country: country?.name,
                                });
                                setCountryPickerVisible(false);
                            }}
                            containerButtonStyle={styles.countryPicker}
                        />
                    </TemplateBox>
                </TemplateBox>

                <UpdateBrandsWorkedWith />
                <UpdateCategories />
                {/* <UpdateWorkExamples /> */}
                <UpdateRates />
            </Wrapper>
            {loading && <LoadingOverlay message={t('profile.updatePortfolio.updatingMessage')} />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        paddingBottom: SPACE_XXLARGE,
    },
    contentContainer: {
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    input: {
        height: 60,
        borderWidth: 1,
        width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 10,
        color: BLACK,
    },
    countryPicker: {
        color: BLACK,
    },
});
export default UpdatePortfolioScreen;
