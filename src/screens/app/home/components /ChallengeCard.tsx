import TemplateBox from '../../../../components/TemplateBox';
import { BLACK, BLACK_SECONDARY, WHITE } from '../../../../theme/Colors';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import React, { useMemo } from 'react';
import { Image } from 'react-native';
//@ts-ignore
import challengeCardImage from '../../../../../assets/images/challenge-background.jpg';
import DynamicIcon from '../../../../components/icons/DynamicIcon';
import TemplateText from '../../../../components/TemplateText';
import Button from '../../../../components/Button';
interface ChallengeCardProps {
    onPress?: () => void;
    loading?: boolean;
    prizePoolUsd?: number;
    challengeTitle?: string;
    shortDescriptionSegments?: { text: string; bold: boolean }[];
    enrollmentStartAt?: Date;
    challengeStartAt?: Date;
    challengeEndAt?: Date;
    getStatusLabel: (
        enrollmentStartAt: Date | undefined,
        challengeStartAt: Date | undefined,
        challengeEndAt: Date | undefined,
        now: Date,
    ) => string;
    canEnrollNow: (enrollmentStartAt: Date | undefined, challengeEndAt: Date | undefined, now: Date) => boolean;
}
const ChallengeCard = ({
    onPress,
    loading,
    prizePoolUsd,
    challengeTitle,
    shortDescriptionSegments,
    enrollmentStartAt,
    challengeStartAt,
    challengeEndAt,
    getStatusLabel,
    canEnrollNow,
}: ChallengeCardProps) => {
    const now = useMemo(() => new Date(), []);
    const statusLabel = getStatusLabel(enrollmentStartAt, challengeStartAt, challengeEndAt, now);
    const isEnrollmentOpen = canEnrollNow(enrollmentStartAt, challengeEndAt, now);
    const segments = shortDescriptionSegments ?? [];

    return (
        <TemplateBox
            mh={WRAPPER_MARGIN}
            ph={15}
            borderRadius={20}
            mb={20}
            alignItems="center"
            backgroundColor={WHITE}
            height={250}
            overflow="hidden"
        >
            <TemplateBox absolute top={0} left={0} right={0} overflow="hidden" height={250}>
                <Image source={challengeCardImage} style={{ width: '100%', height: '100%' }} />
            </TemplateBox>
            <TemplateBox alignItems="center" pAll={15}>
                <TemplateBox row justifyContent="space-between" mb={10} alignItems="center" width="100%">
                    <TemplateBox
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={WHITE}
                        pv={8}
                        ph={15}
                        borderRadius={16}
                        row
                    >
                        <DynamicIcon name="Trophy" size={16} />
                        <TemplateText size={14} medium color={BLACK_SECONDARY} ml={8}>
                            Win up to {prizePoolUsd ? ` $${prizePoolUsd}` : ' 300 USD'}
                        </TemplateText>
                    </TemplateBox>
                    {<TemplateText size={14}>{statusLabel}</TemplateText>}
                </TemplateBox>
                <TemplateText bold size={18} mv={10} caps>
                    {challengeTitle}
                </TemplateText>
                <TemplateText size={14} center lineHeight={20} color={BLACK_SECONDARY}>
                    <TemplateText size={14} center lineHeight={20} color={BLACK_SECONDARY}>
                        {segments.length > 0 &&
                            segments.map((segment, index) =>
                                segment.bold ? (
                                    <TemplateText key={index} size={14} semiBold>
                                        {segment.text}
                                    </TemplateText>
                                ) : (
                                    segment.text
                                ),
                            )}
                    </TemplateText>
                </TemplateText>

                <Button
                    title={isEnrollmentOpen ? 'Enroll Now' : 'Coming Soon!'}
                    width={290}
                    height={40}
                    color={BLACK}
                    style={{ borderRadius: 20, marginTop: 14 }}
                    onPress={onPress}
                    //  disabled={!isEnrollmentOpen}
                />
            </TemplateBox>
        </TemplateBox>
    );
};

export default ChallengeCard;
