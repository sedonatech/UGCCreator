import React from 'react';
import PropTypes from 'prop-types';

import TemplateBox from '../../../../components/TemplateBox';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import openUrl from '../../../../Utils/openUrl';
import { BLACK, BLACK_0_5 } from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';

const ContactSection = ({ contactInfo, socials }) => (
    <TemplateBox mh={WRAPPER_MARGIN} mt={WRAPPER_MARGIN * 2}>
        <TemplateText bold color={BLACK} size={18}>Contact Information</TemplateText>
        <TemplateBox height={10} />
        <TemplateBox
            row
            pAll={10}
            alignItems="center"
            backgroundColor={BLACK_0_5}
            borderRadius={10}
            mb={WRAPPER_MARGIN}
        >
            <TemplateBox pr={20}>
                <TemplateText color={BLACK} bold>Phone Number</TemplateText>
                <TemplateBox height={10} />
                <TemplateText color={BLACK} size={16}>{contactInfo?.phoneNumber}</TemplateText>
            </TemplateBox>
            <TemplateBox flex />
        </TemplateBox>
        <TemplateBox
            row
            pAll={10}
            alignItems="center"
            backgroundColor={BLACK_0_5}
            borderRadius={10}
            mb={WRAPPER_MARGIN}
        >
            <TemplateBox pr={20}>
                <TemplateText color={BLACK} bold>Email</TemplateText>
                <TemplateBox height={10} />
                <TemplateText color={BLACK} size={16}>{contactInfo?.email}</TemplateText>
            </TemplateBox>
            <TemplateBox flex />
        </TemplateBox>
        {socials?.instagram && (
            <TemplateBox
                row
                pAll={10}
                alignItems="center"
                onPress={() => openUrl(socials?.instagram)}
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
                <TemplateText color={BLACK} size={16}>Instagram</TemplateText>
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
                onPress={() => openUrl(socials?.facebook)}
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
                <TemplateText color={BLACK} size={16}>FaceBook</TemplateText>
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
                onPress={() => openUrl(socials?.twitter)}
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
                <TemplateText color={BLACK} size={16}>Twitter</TemplateText>
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
                onPress={() => openUrl(socials?.linkedin)}
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
                <TemplateText color={BLACK} size={16}>LinkedIn</TemplateText>
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
    paypalLink: PropTypes.string,
};

ContactSection.defaultProps = {
    contactInfo: {},
    socials: {},
    paypalLink: '',
};
export default ContactSection;
