import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

import {
    BLACK,
    BLACK_40, GREY_SECONDARY, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import {
    IS_ANDROID, SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import TemplateTextInput from '../../../components/TemplateTextInput';
import TemplateText from '../../../components/TemplateText';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import HeaderIconButton from '../../../components/header/HeaderButton';
import Wrapper from '../../../components/Wrapper';
import LoadingOverlay from '../../../components/LoadingOverlay';
import PortfolioHeader from '../../app/profile/components/PortfolioHeader';
import UpdateCategories from '../../app/profile/components/UpdateCategories';
import { BRANDS_PROFILE } from '../../../navigation/ScreenNames';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const UpdateBrandProfileScreen = ({ navigation, route }) => {
    const fromAdminPanel = route?.params?.fromAdminPanel;

    const [countryPickerVisible, setCountryPickerVisible] = useState(false);

    const { auth } = useAuthContext();

    const {
        profile: profileData, update, updateProfile,
    } = auth;

    const { trackEvent } = useTrackEvent();

    const [loading, setLoading] = useState(false);

    const handleUpdate = () => {
        setTimeout(async () => {
            setLoading(true);
            updateProfile(profileData, profileData?.id);
            await trackEvent('update_brand_profile');
            if (fromAdminPanel) {
                navigation.goBack();
                return;
            }
            setLoading(false);
            navigation.navigate(BRANDS_PROFILE);
        }, 2600);
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
                    title="Save changes"
                    onPress={handleUpdate}
                    backDropColor={GREY_SECONDARY}
                    mr={WRAPPER_MARGIN}
                />
            ),

        });
    }, [navigation, fromAdminPanel]);

    return (
        <Wrapper
            contentContainerStyle={styles.contentContainer}
            style={styles.container}
            keyboard
            safe={false}
        >
            <PortfolioHeader isUpdate />

            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Brand Name</TemplateText>
                <TemplateTextInput
                    placeholder="Brand Name"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.name}
                    onChangeText={(text) => update('name', text)}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Email</TemplateText>
                <TemplateTextInput
                    placeholder="Email"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.email}
                    onChangeText={(text) => {
                        update('email', text);
                        update('contact', {
                            phoneNumber: profileData?.contact?.phoneNumber,
                            email: text,
                            address: profileData?.contact?.address,
                        });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Phone Number</TemplateText>
                <TemplateTextInput
                    placeholder="Phone Number"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.contact?.phoneNumber}
                    onChangeText={(text) => update('contact', {
                        phoneNumber: text,
                        email: profileData?.contact?.email,
                        address: profileData?.contact?.address,
                    })}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Address</TemplateText>
                <TemplateTextInput
                    placeholder="Address"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.contact?.address}
                    onChangeText={(text) => update('contact', {
                        phoneNumber: profileData?.contact?.phoneNumber,
                        email: profileData?.contact?.email,
                        address: text,
                    })}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Short Description</TemplateText>
                <TemplateTextInput
                    placeholder="Short Description"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.shortDescription}
                    onChangeText={(text) => update('shortDescription', text)}
                    autoCapitalize="none"
                    multiline
                    numberOfLines={6}
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Description</TemplateText>
                <TemplateTextInput
                    placeholder="Description"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.description}
                    onChangeText={(text) => update('description', text)}
                    autoCapitalize="none"
                    multiline
                    numberOfLines={26}
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Instagram</TemplateText>
                <TemplateTextInput
                    placeholder="Instagram Link"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.socialMedia?.instagram}
                    onChangeText={(text) => update('socialMedia', {
                        instagram: text,
                        facebook: profileData?.socialMedia?.facebook || '',
                        twitter: profileData?.socialMedia?.twitter || '',
                        linkedin: profileData?.socialMedia?.linkedin || '',
                        website: profileData?.socialMedia?.website || '',
                    })}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Facebook</TemplateText>
                <TemplateTextInput
                    placeholder="Facebook Link"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.socialMedia?.facebook}
                    onChangeText={(text) => update('socialMedia', {
                        instagram: profileData?.socialMedia?.instagram || '',
                        facebook: text,
                        twitter: profileData?.socialMedia?.twitter || '',
                        linkedin: profileData?.socialMedia?.linkedin || '',
                        website: profileData?.socialMedia?.website || '',
                    })}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Twitter</TemplateText>
                <TemplateTextInput
                    placeholder="Twitter Link"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.socialMedia?.twitter}
                    onChangeText={(text) => update('socialMedia', {
                        instagram: profileData?.socialMedia?.instagram || '',
                        facebook: profileData?.socialMedia?.facebook || '',
                        twitter: text,
                        linkedin: profileData?.socialMedia?.linkedin || '',
                        website: profileData?.socialMedia?.website || '',
                    })}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>LinkedIn</TemplateText>
                <TemplateTextInput
                    placeholder="LinkedIn Link"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.socialMedia?.linkedin}
                    onChangeText={(text) => update('socialMedia', {
                        instagram: profileData?.socialMedia?.instagram || '',
                        facebook: profileData?.socialMedia?.facebook || '',
                        twitter: profileData?.socialMedia?.twitter || '',
                        linkedin: text,
                        website: profileData?.socialMedia?.website || '',
                    })}
                    autoCapitalize="none"
                />
            </TemplateBox>
            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Website</TemplateText>
                <TemplateTextInput
                    placeholder="Website"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={profileData?.socialMedia?.website}
                    onChangeText={(text) => update('socialMedia', {
                        instagram: profileData?.socialMedia?.instagram || '',
                        facebook: profileData?.socialMedia?.facebook || '',
                        twitter: profileData?.socialMedia?.twitter || '',
                        linkedin: profileData?.socialMedia?.linkedin || '',
                        website: text,
                    })}
                    autoCapitalize="none"
                />
            </TemplateBox>
            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Location</TemplateText>
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
                    <TemplateText color={BLACK_40} size={16}>{profileData?.location?.country || 'Country'}</TemplateText>
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
                        onSelect={(country) => {
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

            <UpdateCategories />

            {loading && (
                <LoadingOverlay message="Updating your brand information...." ml={-WRAPPER_MARGIN} />
            )}
        </Wrapper>
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
export default UpdateBrandProfileScreen;
