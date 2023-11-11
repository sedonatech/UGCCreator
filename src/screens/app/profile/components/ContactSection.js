import React from 'react';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import { BLACK, BLACK_0_5 } from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import { WEBVIEW } from '../../../../navigation/ScreenNames';

const ContactSection = ({ contactInfo, socials, email }) => {
    const navigation = useNavigation();

    return (
        <TemplateBox mh={WRAPPER_MARGIN} mt={WRAPPER_MARGIN * 2}>
            <TemplateText bold color={BLACK} size={16}>Contact Information</TemplateText>
            <TemplateBox height={10} />
            {contactInfo?.phoneNumber && (
                <TemplateBox
                    row
                    alignItems="center"
                    backgroundColor={BLACK_0_5}
                    borderRadius={10}
                    mb={WRAPPER_MARGIN}
                >
                    <TemplateBox pr={20}>
                        <TemplateText color={BLACK} semiBold size={16}>Phone Number</TemplateText>
                        <TemplateBox height={10} />
                        <TemplateText color={BLACK} size={16}>{contactInfo?.phoneNumber}</TemplateText>
                    </TemplateBox>
                    <TemplateBox flex />
                </TemplateBox>
            )}
            {(contactInfo?.email || email) && (
                <TemplateBox
                    row
                    alignItems="center"
                    backgroundColor={BLACK_0_5}
                    borderRadius={10}
                    mb={WRAPPER_MARGIN}
                >
                    <TemplateBox pr={20}>
                        <TemplateText color={BLACK} semiBold size={16}>Email</TemplateText>
                        <TemplateBox height={10} />
                        <TemplateText color={BLACK} size={14}>{contactInfo?.email || email}</TemplateText>
                    </TemplateBox>
                    <TemplateBox flex />
                </TemplateBox>
            )}
            {socials?.instagram && (
                <TemplateBox
                    row
                    pAll={10}
                    alignItems="center"
                    onPress={() => {
                        if (socials?.instagram) {
                            navigation.navigate(WEBVIEW, { url: socials?.instagram });
                        }
                    }}
                    backgroundColor={BLACK_0_5}
                    borderRadius={10}
                    mb={WRAPPER_MARGIN}
                >
                    <TemplateIcon
                        name="logo-instagram"
                        size={20}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} semiBold size={16}>Instagram</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={20}
                        color={BLACK}
                    />
                </TemplateBox>
            )}
            {socials?.facebook && (
                <TemplateBox
                    row
                    pAll={10}
                    alignItems="center"
                    onPress={() => {
                        if (socials?.facebook) {
                            navigation.navigate(WEBVIEW, { url: socials?.facebook });
                        }
                    }}
                    backgroundColor={BLACK_0_5}
                    borderRadius={10}
                    mb={WRAPPER_MARGIN}
                >
                    <TemplateIcon
                        name="logo-facebook"
                        size={20}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} size={16} semiBold>FaceBook</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={20}
                        color={BLACK}
                    />
                </TemplateBox>
            )}

            {socials?.twitter && (
                <TemplateBox
                    row
                    pAll={10}
                    alignItems="center"
                    onPress={() => {
                        if (socials?.twitter) {
                            navigation.navigate(WEBVIEW, { url: socials?.twitter });
                        }
                    }}
                    backgroundColor={BLACK_0_5}
                    borderRadius={10}
                    mb={WRAPPER_MARGIN}
                >
                    <TemplateIcon
                        name="logo-twitter"
                        size={20}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} size={16} semiBold>Twitter</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={20}
                        color={BLACK}
                    />
                </TemplateBox>
            )}

            {socials?.linkedin && (
                <TemplateBox
                    row
                    pAll={10}
                    alignItems="center"
                    onPress={() => {
                        if (socials?.linkedin) {
                            navigation.navigate(WEBVIEW, { url: socials?.linkedin });
                        }
                    }}
                    backgroundColor={BLACK_0_5}
                    borderRadius={10}
                    mb={WRAPPER_MARGIN}
                >
                    <TemplateIcon
                        name="logo-linkedin"
                        size={20}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} size={16} semiBold>LinkedIn</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={20}
                        color={BLACK}
                    />
                </TemplateBox>
            )}

        </TemplateBox>
    );
};

ContactSection.propTypes = {
    contactInfo: PropTypes.shape({
        address: PropTypes.string,
        phoneNumber: PropTypes.string,
        email: PropTypes.string,
    }),
    socials: PropTypes.shape({
        instagram: PropTypes.string,
        facebook: PropTypes.string,
        twitter: PropTypes.string,
        linkedin: PropTypes.string,
    }),
    email: PropTypes.string,
};

ContactSection.defaultProps = {
    contactInfo: {},
    socials: {},
    email: '',
};
export default ContactSection;
