import TemplateBox from '../../../../components/TemplateBox';
import { BLACK, BLACK_SECONDARY, WHITE } from '../../../../theme/Colors';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import React, { useEffect, useMemo } from 'react';
import { Image } from 'react-native';
//@ts-ignore
import challengeCardImage from '../../../../../assets/images/challenge-background.jpg';
import DynamicIcon from '../../../../components/icons/DynamicIcon';
import TemplateText from '../../../../components/TemplateText';
import Button from '../../../../components/Button';
import { getChallengeCta, isUserEnrolledInChallenge } from '../../../../hooks/useChallenge';
interface ChallengeCardProps {
    onPress?: () => void;
    loading?: boolean;
    challengeId?: string;
    currentUserId?: string;
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
    challengeId,
    prizePoolUsd,
    challengeTitle,
    shortDescriptionSegments,
    enrollmentStartAt,
    challengeStartAt,
    challengeEndAt,
    currentUserId,
    getStatusLabel,
    canEnrollNow,
}: ChallengeCardProps) => {
    const now = useMemo(() => new Date(), []);
    const statusLabel = getStatusLabel(enrollmentStartAt, challengeStartAt, challengeEndAt, now);
    const isEnrollmentOpen = canEnrollNow(enrollmentStartAt, challengeEndAt, now);
    const [isEnrolled, setIsEnrolled] = React.useState<boolean>(false);
    const [enrollmentLoading, setEnrollmentLoading] = React.useState<boolean>(true);
    const segments = shortDescriptionSegments ?? [];

    useEffect(() => {
        if (!challengeId || !currentUserId) {
            setIsEnrolled(false);
            setEnrollmentLoading(false);
            return;
        }

        let cancelled = false;

        const checkEnrollment = async () => {
            try {
                const enrolled = await isUserEnrolledInChallenge({
                    challengeId,
                    userId: currentUserId,
                });
                if (!cancelled) {
                    setIsEnrolled(enrolled);
                }
            } catch (error) {
                console.error('Error checking enrollment:', error);
                if (!cancelled) {
                    setIsEnrolled(false);
                }
            } finally {
                if (!cancelled) {
                    setEnrollmentLoading(false);
                }
            }
        };

        checkEnrollment();

        return () => {
            cancelled = true;
        };
    }, [challengeId, currentUserId]);

    const cta = getChallengeCta({
        enrollmentStartAt,
        challengeStartAt,
        challengeEndAt,
        now,
        isEnrolled,
    });

    return (
        <TemplateBox
            mh={WRAPPER_MARGIN}
            ph={10}
            borderRadius={20}
            mb={20}
            mt={20}
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
                        <TemplateText size={17} medium color={BLACK_SECONDARY} ml={8}>
                            Win up to {prizePoolUsd ? ` $${prizePoolUsd}` : ' 300 USD'}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText size={13} medium>
                        {statusLabel}
                    </TemplateText>
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
                    title={cta?.title}
                    width={290}
                    height={40}
                    color={BLACK}
                    style={{ borderRadius: 20, marginTop: 14 }}
                    onPress={onPress}
                    disabled={cta?.disabled || enrollmentLoading || loading}
                />
            </TemplateBox>
        </TemplateBox>
    );
};

export default ChallengeCard;
