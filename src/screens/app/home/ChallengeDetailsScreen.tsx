import React, { FC, useEffect, useMemo, useState } from 'react';
//@ts-ignore
import challengeBackground from '../../../../assets/images/challenge-background.jpg';
import firestore from '@react-native-firebase/firestore';
import { Image, ScrollView } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLACK_SECONDARY,
    DARK_GREY,
    DARK_METAL,
    METAL,
    WHITE_30,
    WHITE_40,
} from '../../../theme/Colors';
import DynamicIcon from '../../../components/icons/DynamicIcon';
import ToggleTab from '../../../components/ToggleTab';
import Button from '../../../components/Button';
import useChallenge, {
    Challenge,
    enrollInChallenge,
    getChallengeCta,
    isUserEnrolledInChallenge,
} from '../../../hooks/useChallenge';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const TOGGLE_TABS = ['Brief', 'Rules', 'Prizes'];
type RouteParams = {
    params?: {
        challengeId?: string;
    };
};
interface ChallengeDetailsScreenProps {
    route: RouteParams;
    navigation: any;
}

const ChallengeDetailsScreen: FC<ChallengeDetailsScreenProps> = ({ route, navigation }) => {
    const { auth } = useAuthContext();
    const challengeId = route?.params?.challengeId;
    const profile = auth?.profile;
    console.log('🚀 ~ ChallengeDetailsScreen ~ profile:', profile);
    const currentUserId = profile?.id;
    const [activeTab, setActiveTab] = useState(TOGGLE_TABS[0]);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('challenges')
            .doc(challengeId)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot.exists()) {
                    setChallenge(documentSnapshot.data() as Challenge);
                } else {
                    setChallenge(null);
                }
                setLoading(false);
            });

        return () => unsubscribe();
    }, [challengeId]);

    const { getStatusLabel, canEnrollNow, getEndsInLabel } = useChallenge();
    const now = useMemo(() => new Date(), []);
    const statusLabel = getStatusLabel(
        challenge?.enrollmentStartAt?.toDate(),
        challenge?.challengeStartAt?.toDate(),
        challenge?.challengeEndAt?.toDate(),
        now,
    );
    const isEnrollmentOpen = canEnrollNow(
        challenge?.enrollmentStartAt?.toDate(),
        challenge?.challengeEndAt?.toDate(),
        now,
    );
    const endsInLabel = getEndsInLabel(challenge?.challengeEndAt?.toDate(), now);
    const isEnrolled =
        isUserEnrolledInChallenge({ challengeId: challengeId || '', userId: currentUserId || '' }) || false;
    const enrollmentStartDate = challenge?.enrollmentStartAt?.toDate();
    const challengeStartDate = challenge?.challengeStartAt?.toDate();
    const challengeEndDate = challenge?.challengeEndAt?.toDate();

    const { title: enrollButtonTitle, disabled: enrollButtonDisabled } = getChallengeCta({
        enrollmentStartAt: enrollmentStartDate,
        challengeStartAt: challengeStartDate,
        challengeEndAt: challengeEndDate,
        now,
        isEnrolled,
    });

    const handleEnrollPress = async () => {
        if (!challengeId) {
            return;
        }
        if (!isEnrollmentOpen) {
            return;
        }
        if (enrolling) {
            return;
        }

        try {
            setEnrolling(true);
            await enrollInChallenge({
                challengeId,
                userId: currentUserId,
                userName: profile?.userName || '',
                userEmail: profile?.email || '',
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error enrolling in challenge:', error);
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <ScrollView>
            <TemplateBox width={SCREEN_WIDTH} height={260}>
                <TemplateBox absolute top={0} left={0} right={0} overflow="hidden" height={260}>
                    <Image source={challengeBackground} style={{ width: '100%', height: '100%' }} />
                </TemplateBox>
                <TemplateBox absolute bottom={30} left={20}>
                    <TemplateText bold size={22} mb={16} caps style={{ maxWidth: SCREEN_WIDTH - 140 }}>
                        {challenge?.title || 'Challenge Title'}
                    </TemplateText>
                    <TemplateBox row>
                        <TemplateBox
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={WHITE_40}
                            ph={16}
                            pv={6}
                            borderRadius={26}
                            borderWidth={1}
                            borderColor={BLACK_20}
                            row
                            mr={10}
                        >
                            <TemplateText size={14} medium color={BLACK_SECONDARY}>
                                {statusLabel}
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={WHITE_40}
                            ph={16}
                            pv={6}
                            borderRadius={26}
                            borderWidth={1}
                            borderColor={BLACK_20}
                            row
                            mr={10}
                        >
                            <TemplateText size={14} medium color={BLACK_SECONDARY}>
                                {endsInLabel}
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox
                row
                mv={16}
                mh={20}
                alignItems="center"
                justifyContent="space-between"
                width={SCREEN_WIDTH - 40}
            >
                <TemplateBox
                    backgroundColor={BLACK_10}
                    borderRadius={16}
                    pAll={18}
                    alignItems="center"
                    justifyContent="center"
                    width={(SCREEN_WIDTH - 60) / 2}
                >
                    <TemplateBox row alignItems="center" mb={6}>
                        <DynamicIcon name="Trophy" size={16} />
                        <TemplateText color={DARK_GREY} size={16} ml={6}>
                            Price Pool
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText semiBold size={20}>
                        Up to {challenge?.prizePoolUsd || 0}$
                    </TemplateText>
                </TemplateBox>

                <TemplateBox
                    backgroundColor={BLACK_10}
                    borderRadius={16}
                    pAll={18}
                    alignItems="center"
                    justifyContent="center"
                    width={(SCREEN_WIDTH - 60) / 2}
                >
                    <TemplateBox row alignItems="center" mb={6}>
                        <DynamicIcon name="People" size={16} />
                        <TemplateText color={DARK_GREY} size={16} ml={6}>
                            Participants
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText semiBold size={20}>
                        {challenge?.participantCount || 0}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <ToggleTab activeTab={activeTab} tabs={TOGGLE_TABS} onPress={setActiveTab} />
            {activeTab === TOGGLE_TABS[0] && (
                <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={80}>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps>
                        The mission
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={DARK_METAL} medium>
                        {challenge?.brief?.mission}
                    </TemplateText>

                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps mt={20}>
                        How to participate
                    </TemplateText>
                    {challenge?.brief?.howToParticipate.map((point, index) => (
                        <TemplateBox key={index} mb={10}>
                            <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                                <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                                    {index + 1}. {point.title}
                                </TemplateText>{' '}
                                {point.description}
                            </TemplateText>
                        </TemplateBox>
                    ))}
                </TemplateBox>
            )}
            {activeTab === TOGGLE_TABS[1] && (
                <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={80}>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps>
                        Rules of the challenge
                    </TemplateText>
                    {challenge?.rules.map((rule, index) => (
                        <TemplateText
                            key={index}
                            size={16}
                            lineHeight={24}
                            color={index === challenge?.rules?.length - 1 ? DARK_METAL : METAL}
                            mb={5}
                            medium={index === challenge?.rules?.length - 1}
                        >
                            <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                                {index + 1}.
                            </TemplateText>{' '}
                            {rule}
                        </TemplateText>
                    ))}
                </TemplateBox>
            )}
            {activeTab === TOGGLE_TABS[2] && (
                <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={100}>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} caps>
                        Prizes & rewards
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            * Grand Prize:
                        </TemplateText>{' '}
                        {challenge?.prizes.grandPrize}
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            * Runners Up:
                        </TemplateText>{' '}
                        {challenge?.prizes.runnersUp}
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={5}>
                        <TemplateText size={16} lineHeight={24} color={METAL} mb={5} semiBold>
                            * All Participants:
                        </TemplateText>{' '}
                        {challenge?.prizes.allParticipants}
                    </TemplateText>
                </TemplateBox>
            )}
            <TemplateBox
                absolute
                bottom={20}
                selfCenter
                backgroundColor={WHITE_30}
                width={SCREEN_WIDTH}
                alignItems="center"
                pt={30}
            >
                <Button
                    title={enrollButtonTitle}
                    height={50}
                    width={SCREEN_WIDTH - 40}
                    color={BLACK}
                    onPress={handleEnrollPress}
                    disabled={enrollButtonDisabled}
                />
            </TemplateBox>
        </ScrollView>
    );
};
export default ChallengeDetailsScreen;
