import React, { FC } from 'react';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import {
    BLACK, BLACK_0_5
} from '../../../../theme/Colors';
import TemplateIcon from '../../../../components/TemplateIcon';
import openUrl from '../../../../Utils/openUrl';
import { wp } from '../../../../Utils/getResponsiveSize';
import useChatsContext from '../../../../hooks/chats/useChatsContext';
import useAuthContext from '../../../../hooks/auth/useAuthContext';

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
    name?: string;
    brandFCMToken?: string;
    brandId?: string;
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
    name,
    brandFCMToken,
    brandId,
}) => {
    const { auth } = useAuthContext();

    const {
        createChatRoom
    } = useChatsContext();

    const creatorFCMToken = auth?.profile?.fcmToken;

    const creatorName = auth?.profile?.userName;

    const creatorId = auth?.profile?.id;

    const chatRoomName = `BRAND:${name} - CREATOR:${creatorName} chat`;

    return (
        <TemplateBox
            ph={WRAPPER_MARGIN}
            mt={WRAPPER_MARGIN}
        >

            {description && (
                <TemplateBox>
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
                    <TemplateBox height={WRAPPER_MARGIN} />
                </TemplateBox>
            )}
            {!!address && (
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
                        <TemplateText color={BLACK} semiBold size={wp(14)}>Address</TemplateText>
                        <TemplateBox height={10} />
                        <TemplateText color={BLACK} size={14}>{address}</TemplateText>
                    </TemplateBox>
                    <TemplateBox flex />
                </TemplateBox>
            )}
            {phone && (
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
                        <TemplateText color={BLACK} semiBold size={wp(14)}>Phone Number</TemplateText>
                        <TemplateBox height={10} />
                        <TemplateText color={BLACK} size={14}>{phone}</TemplateText>
                    </TemplateBox>
                    <TemplateBox flex />
                </TemplateBox>
            )}
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
                        size={16}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} semiBold size={wp(14)}>Instagram</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={16}
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
                        size={16}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} semiBold size={wp(14)}>FaceBook</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={16}
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
                        size={16}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} semiBold size={wp(14)}>Twitter</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={16}
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
                        size={16}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} semiBold size={wp(14)}>LinkedIn</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={16}
                        color={BLACK}
                    />
                </TemplateBox>
            )}
            <TemplateBox
                row
                pAll={10}
                alignItems="center"
                onPress={() => openUrl(profileUrl, `This link is not available. You can still contact ${name} by email or chat below`)}
                backgroundColor={BLACK_0_5}
                borderRadius={10}
            >
                <TemplateText color={BLACK} semiBold size={wp(14)}>
                    Check out our website
                </TemplateText>
                <TemplateBox flex />
                <TemplateIcon
                    name="open-outline"
                    size={16}
                    color={BLACK}
                />
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />

            {email && (
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
                        name="mail-outline"
                        size={16}
                        color={BLACK}
                    />
                    <TemplateBox width={10} />
                    <TemplateText color={BLACK} semiBold size={wp(14)}>Send an email</TemplateText>
                    <TemplateBox flex />
                    <TemplateIcon
                        name="open-outline"
                        size={16}
                        color={BLACK}
                    />
                </TemplateBox>
            )}

            <TemplateBox
                row
                pAll={10}
                alignItems="center"
                onPress={async () => {
                    await createChatRoom(
                        chatRoomName,
                        creatorId,
                        brandId,
                        creatorFCMToken,
                        brandFCMToken,
                    );
                }}
                backgroundColor={BLACK_0_5}
                borderRadius={10}
                mb={WRAPPER_MARGIN}
            >
                <TemplateIcon
                    name="chatbubbles-outline"
                    size={16}
                    color={BLACK}
                />
                <TemplateBox width={10} />
                <TemplateText color={BLACK} semiBold size={wp(14)}>Start a conversation</TemplateText>
                <TemplateBox flex />
                <TemplateIcon
                    name="open-outline"
                    size={16}
                    color={BLACK}
                />
            </TemplateBox>
        </TemplateBox>
    );
};

export default DescriptionTab;
