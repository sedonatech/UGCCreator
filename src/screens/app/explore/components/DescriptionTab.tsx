import React, { FC } from 'react';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import {
    BLACK, BLACK_0_5, BLACK_10, BLACK_20, BLACK_40, BLACK_50, BLACK_60, BLACK_80, WHITE_50
} from '../../../../theme/Colors';
import TemplateIcon from '../../../../components/TemplateIcon';
import openUrl from '../../../../Utils/openUrl';

interface DescriptionTabProps {
    description: string;
    profileUrl: string;

    phone?: string;
    email?: string;
    address?: string;

    instagram?: string;

    facebook?: string;

    twitter?: string;

    tiktok?: string;

    linkedin?: string;
}
const DescriptionTab: FC<DescriptionTabProps> = ({
    description,
    profileUrl,
    email,
    phone,
    address,
    instagram,
    facebook,
    twitter,
    tiktok,
    linkedin,

}) => (
    <TemplateBox
        ph={WRAPPER_MARGIN}
        mt={WRAPPER_MARGIN}
    >
        <TemplateText color={BLACK} bold>
            Who are we?
        </TemplateText>
        <TemplateBox height={WRAPPER_MARGIN} />
        <TemplateText
            color={BLACK}
            size={14}
            lineHeight={22}
        >
            {description}
        </TemplateText>
        <TemplateBox height={WRAPPER_MARGIN * 3} />

        <TemplateBox
            row
            pAll={10}
            alignItems="center"
            onPress={() => openUrl(profileUrl)}
            backgroundColor={BLACK_0_5}
            borderRadius={10}
            mb={WRAPPER_MARGIN}
        >
            <TemplateBox pr={20}>
                <TemplateText color={BLACK} bold>Address</TemplateText>
                <TemplateBox height={10} />
                <TemplateText color={BLACK} size={16}>{address}</TemplateText>
            </TemplateBox>
            <TemplateBox flex />
        </TemplateBox>
        <TemplateBox
            row
            pAll={10}
            alignItems="center"
            onPress={() => openUrl(profileUrl)}
            backgroundColor={BLACK_0_5}
            borderRadius={10}
            mb={WRAPPER_MARGIN}
        >
            <TemplateBox pr={20}>
                <TemplateText color={BLACK} bold>Phone Number</TemplateText>
                <TemplateBox height={10} />
                <TemplateText color={BLACK} size={16}>{phone}</TemplateText>
            </TemplateBox>
            <TemplateBox flex />
        </TemplateBox>
        {instagram && (
            <TemplateBox
                row
                pAll={10}
                alignItems="center"
                onPress={() => openUrl(instagram)}
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
        {facebook && (
            <TemplateBox
                row
                pAll={10}
                alignItems="center"
                onPress={() => openUrl(facebook)}
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

        {twitter && (
            <TemplateBox
                row
                pAll={10}
                alignItems="center"
                onPress={() => openUrl(twitter)}
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

        {linkedin && (
            <TemplateBox
                row
                pAll={10}
                alignItems="center"
                onPress={() => openUrl(tiktok)}
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
        <TemplateBox
            row
            pAll={10}
            alignItems="center"
            onPress={() => {
                if (profileUrl) {
                    openUrl(profileUrl);
                }
            }}
            backgroundColor={BLACK_0_5}
            borderRadius={10}
        >
            <TemplateText color={BLACK}>
                Check out our website
            </TemplateText>
            <TemplateBox flex />
            <TemplateIcon
                name="open-outline"
                size={20}
                color={BLACK}
            />
        </TemplateBox>
        <TemplateBox height={WRAPPER_MARGIN * 2} />
    </TemplateBox>
);

export default DescriptionTab;
