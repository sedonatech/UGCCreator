import React, { FC, useEffect, useLayoutEffect, useMemo, useState } from 'react';
//@ts-ignore
import challengeBackground from '../../../../assets/images/challenge-background.jpg';
//@ts-ignore
import kegelChallengeImage from '../../../../assets/images/kegel-challenge-background.jpg';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import { SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK,
    BLACK_10,
    BLACK_20,
    BLACK_SECONDARY,
    BLUE_500,
    DARK_GREY,
    DARK_METAL,
    IOS_BLUE_20,
    METAL,
    RED_500,
    WHITE_30,
    WHITE_40,
} from '../../../theme/Colors';
import DynamicIcon from '../../../components/icons/DynamicIcon';
import ToggleTab from '../../../components/ToggleTab';
import Button from '../../../components/Button';
import useChallenge, {
    Challenge,
    ChallengeMetrics,
    ChallengeSubmission,
    enrollInChallenge,
    getChallengeCta,
    isUserEnrolledInChallenge,
    upsertChallengeSubmission,
} from '../../../hooks/useChallenge';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { useChallengeSubmission } from '../../../hooks/useChallengeSubmission';
import ChallengeSubmissionModal from '../../../components/modals/ChallengeSubmissionModal';
import ChallengeEntryCard from '../../../components/cards/ChallengeEntryCard';
import ChallengeLeaderBoardModal from '../../../components/modals/ChallengeLeaderBoardModal';
import openUrl from '../../../Utils/openUrl';
import { WEBVIEW } from '../../../navigation/ScreenNames';
import useTranslation from '../../../hooks/useTranslation';
const FEEDBACK_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSe0PYFCmCOoPDZFuQdQV63Swk3AAKolNQnOc3ZN9md4LM2ZJw/viewform?usp=publish-editor';

type RouteParams = {
    params?: {
        challengeId?: string;
    };
};
export type MetricsForm = {
    views: string;
    likes: string;
    comments: string;
    shares: string;
    saves: string;
    title: string;
};

interface ChallengeDetailsScreenProps {
    route: RouteParams;
    navigation: any;
}

const ChallengeDetailsScreen: FC<ChallengeDetailsScreenProps> = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { auth } = useAuthContext();
    const challengeId = route?.params?.challengeId;
    const profile = auth?.profile;
    const currentUserId = profile?.id;
    const TOGGLE_TABS = [
        t('challenges.tabs.brief'),
        t('challenges.tabs.rules'),
        t('challenges.tabs.prizes'),
        t('challenges.tabs.entries'),
    ];
    const [activeTab, setActiveTab] = useState(TOGGLE_TABS[0]);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentLoading, setEnrollmentLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isLeaderBoardModalVisible, setIsLeaderBoardModalVisible] = useState(false);
    const imageSource = useMemo(() => {
        if (challengeId === 'three_week_kegel_app_video_challenge') {
            return kegelChallengeImage;
        }
        return challengeBackground;
    }, [challengeId]);

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

    // challenge submission
    const [isEntriesModalVisible, setIsEntriesModalVisible] = useState(false);
    const { submissions, submissionsLoading, leaderBoardEntries, topEntry, leaderBoardEntriesLoading } =
        useChallengeSubmission(challengeId, currentUserId);

    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [metricsForm, setMetricsForm] = useState<MetricsForm>({
        views: '',
        likes: '',
        comments: '',
        shares: '',
        saves: '',
        title: '',
    });

    const [savingEntry, setSavingEntry] = useState(false);

    const startEditEntry = (entry: ChallengeSubmission) => {
        if (!entry.id) return;
        setEditingEntryId(entry.id);
        setVideoUrl(entry.videoUrl);
        setMetricsForm({
            views: String(entry.metrics.views ?? 0),
            likes: String(entry.metrics.likes ?? 0),
            comments: String(entry.metrics.comments ?? 0),
            shares: String(entry.metrics.shares ?? 0),
            saves: String(entry.metrics.saves ?? 0),
            title: entry.metrics.title ?? '',
        });
    };

    const resetEntryForm = () => {
        setEditingEntryId(null);
        setVideoUrl('');
        setMetricsForm({
            views: '',
            likes: '',
            comments: '',
            shares: '',
            saves: '',
            title: '',
        });
    };

    const handleMetricChange = (field: keyof typeof metricsForm, value: string) => {
        setMetricsForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEntry = async () => {
        if (!challengeId || !currentUserId) {
            return;
        }
        if (!videoUrl.trim()) {
            return;
        }
        const metrics: ChallengeMetrics = {
            views: Number(metricsForm.views) || 0,
            likes: Number(metricsForm.likes) || 0,
            comments: Number(metricsForm.comments) || 0,
            shares: Number(metricsForm.shares) || 0,
            saves: Number(metricsForm.saves) || 0,
            title: metricsForm.title || '',
        };
        try {
            setSavingEntry(true);
            await upsertChallengeSubmission({
                challengeId,
                userId: currentUserId,
                userName: profile?.userName || '',
                userEmail: profile?.email || '',
                videoUrl: videoUrl.trim(),
                metrics,
                submissionId: editingEntryId || undefined,
            });
            resetEntryForm();
        } catch (error) {
            console.error('Error saving challenge entry:', error);
        } finally {
            setSavingEntry(false);
        }
    };

    // labels
    const { getStatusLabel, canEnrollNow, getEndsInLabel } = useChallenge();
    const now = useMemo(() => new Date(), []);
    const nowMs = now.getTime();

    const statusLabel = getStatusLabel(
        challenge?.enrollmentStartAt?.toDate(),
        challenge?.challengeStartAt?.toDate(),
        challenge?.challengeEndAt?.toDate(),
        now,
        t,
    );
    const isEnrollmentOpen = canEnrollNow(
        challenge?.enrollmentStartAt?.toDate(),
        challenge?.challengeEndAt?.toDate(),
        now,
    );
    const endsInLabel = getEndsInLabel(challenge?.challengeEndAt?.toDate(), now, t);
    const enrollmentStartDate = challenge?.enrollmentStartAt?.toDate();
    const challengeStartDate = challenge?.challengeStartAt?.toDate();
    const challengeStartMs = challengeStartDate?.getTime() ?? 0;
    const challengeEndDate = challenge?.challengeEndAt?.toDate();
    const { title: enrollButtonTitle, disabled: enrollButtonDisabled } = getChallengeCta({
        enrollmentStartAt: enrollmentStartDate,
        challengeStartAt: challengeStartDate,
        challengeEndAt: challengeEndDate,
        now,
        isEnrolled,
        t,
    });
    const isChallengeStarted = nowMs >= challengeStartMs;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TemplateBox row>
                    <TemplateBox
                        onPress={() => navigation.navigate(WEBVIEW, { url: FEEDBACK_FORM_URL })}
                        mr={WRAPPER_MARGIN}
                        alignItems="center"
                        row
                    >
                        <TemplateText size={13} medium color={BLACK} mr={6}>
                            {t('challenges.feedbackButton')}
                        </TemplateText>
                        <DynamicIcon name="Comments" size={20} />
                    </TemplateBox>

                    <TemplateBox
                        backgroundColor={WHITE_30}
                        row
                        mr={10}
                        alignItems="center"
                        borderWidth={1}
                        borderColor={BLACK_20}
                        borderRadius={26}
                        onPress={() => {
                            if (!isChallengeStarted) {
                                Alert.alert(
                                    t('challenges.notStartedAlert.title'),
                                    t('challenges.notStartedAlert.message'),
                                );
                            } else {
                                setIsLeaderBoardModalVisible(true);
                            }
                        }}
                        ph={16}
                        pv={8}
                    >
                        <TemplateText color={BLACK_SECONDARY} size={14} mr={6}>
                            {t('challenges.leaderBoardButton')}
                        </TemplateText>
                        <DynamicIcon name={'ArrowRight'} color={BLACK_SECONDARY} size={18} />
                    </TemplateBox>
                </TemplateBox>
            ),
        });
    }, [navigation, isChallengeStarted]);
    const onCtaPress = async () => {
        if (!challengeId) {
            return;
        }
        if (!isEnrollmentOpen) {
            return;
        }
        if (enrolling) {
            return;
        }
        if (isEnrolled) {
            setActiveTab(TOGGLE_TABS[3]);
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
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewMain}>
            {(loading || submissionsLoading) && (
                <TemplateBox absolute selfCenter mt={SCREEN_HEIGHT / 2.5}>
                    <ActivityIndicator color={BLUE_500} size={'large'} />
                </TemplateBox>
            )}
            <TemplateBox width={SCREEN_WIDTH} height={260}>
                <TemplateBox absolute top={0} left={0} right={0} overflow="hidden" height={260}>
                    <Image source={imageSource} style={styles.backgroundImage} />
                </TemplateBox>
                <TemplateBox absolute bottom={30} left={20}>
                    <TemplateText bold size={22} mb={16} caps style={{ maxWidth: SCREEN_WIDTH - 140 }}>
                        {challenge?.title || t('challenges.details.challengeTitle')}
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
                            {t('challenges.details.pricePool')}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateText semiBold size={20}>
                        {t('challenges.details.upTo')} {challenge?.prizePoolUsd || 0}$
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
                            {t('challenges.details.participants')}
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
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10}>
                        {t('challenges.details.about', { product: challenge?.brief?.productName })}
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={DARK_METAL} medium>
                        {challenge?.brief?.about}
                    </TemplateText>
                    <TemplateBox row>
                        <TemplateBox
                            row
                            mb={10}
                            backgroundColor={IOS_BLUE_20}
                            borderRadius={26}
                            mt={20}
                            mr={10}
                            height={36}
                            width={130}
                            alignItems="center"
                            justifyContent="center"
                            onPress={() => {
                                openUrl(challenge?.brief?.links?.appStoreUrl || '');
                            }}
                        >
                            <TemplateText size={14} color={DARK_METAL} semiBold mr={8}>
                                {t('challenges.details.appStore')}
                            </TemplateText>
                            <DynamicIcon name={'Link'} size={14} />
                        </TemplateBox>
                        <TemplateBox
                            row
                            mb={10}
                            backgroundColor={IOS_BLUE_20}
                            borderRadius={26}
                            mt={20}
                            mr={10}
                            height={36}
                            width={130}
                            alignItems="center"
                            justifyContent="center"
                            onPress={() => {
                                openUrl(challenge?.brief?.links?.website || '');
                            }}
                        >
                            <TemplateText size={14} color={DARK_METAL} semiBold mr={8}>
                                {t('challenges.details.website')}
                            </TemplateText>
                            <DynamicIcon name={'Link'} size={14} />
                        </TemplateBox>
                    </TemplateBox>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} mt={16}>
                        {t('challenges.details.theMission')}
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={DARK_METAL} medium>
                        {challenge?.brief?.mission}
                    </TemplateText>

                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10} mt={20}>
                        {t('challenges.details.howToParticipate')}
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
                    <TemplateText size={16} lineHeight={24} color={RED_500} mb={10} center semiBold>
                        ‼️{challenge?.brief?.disqualificationRule}
                    </TemplateText>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10}>
                        {t('challenges.details.rulesOfChallenge')}
                    </TemplateText>
                    {challenge?.rules.map((rule, index) => (
                        <TemplateText
                            key={index}
                            size={16}
                            lineHeight={24}
                            color={index === challenge?.rules?.length - 1 ? BLACK : METAL}
                            mb={12}
                            medium={index === challenge?.rules?.length - 1}
                        >
                            <TemplateText
                                size={16}
                                lineHeight={24}
                                color={index === challenge?.rules?.length - 1 ? BLACK : METAL}
                                mb={5}
                                semiBold
                            >
                                {index + 1}.
                            </TemplateText>{' '}
                            {rule}
                        </TemplateText>
                    ))}
                </TemplateBox>
            )}
            {activeTab === TOGGLE_TABS[2] && (
                <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={100}>
                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={10}>
                        {t('challenges.details.prizesAndRewards')}
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={10}>
                        <TemplateText size={16} lineHeight={24} color={BLACK} mb={10} semiBold>
                            {t('challenges.details.grandPrize')}
                        </TemplateText>{' '}
                        {challenge?.prizes.grandPrize}
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={10}>
                        <TemplateText size={16} lineHeight={24} color={BLACK} mb={10} semiBold>
                            {t('challenges.details.runnersUp')}
                        </TemplateText>{' '}
                        {challenge?.prizes.runnersUp}
                    </TemplateText>
                    <TemplateText size={16} lineHeight={24} color={METAL} mb={10}>
                        <TemplateText size={16} lineHeight={24} color={BLACK} mb={10} semiBold>
                            {t('challenges.details.allParticipants')}
                        </TemplateText>{' '}
                        {challenge?.prizes.allParticipants}
                    </TemplateText>
                </TemplateBox>
            )}
            {activeTab === TOGGLE_TABS[3] && (
                <TemplateBox>
                    {!isChallengeStarted ? (
                        <TemplateBox mt={100} justifyContent="center" alignItems="center">
                            <TemplateText center size={16} color={BLACK_SECONDARY} mb={30}>
                                {t('challenges.details.notStartedYet')}
                            </TemplateText>
                        </TemplateBox>
                    ) : (
                        <TemplateBox ph={WRAPPER_MARGIN} mt={20} mb={100}>
                            <TemplateBox>
                                <TemplateBox row alignItems="center" justifyContent="space-between" mb={10}>
                                    <TemplateText size={18} semiBold color={BLACK_SECONDARY} mb={8}>
                                        {submissions?.length > 0
                                            ? t('challenges.details.myEntries')
                                            : t('challenges.details.submitYourEntries')}
                                    </TemplateText>
                                    {submissions?.length > 0 && (
                                        <TemplateBox
                                            row
                                            alignItems="center"
                                            onPress={() => setIsEntriesModalVisible(true)}
                                            mb={8}
                                        >
                                            <DynamicIcon name="Add" size={20} color={BLACK} />
                                            <TemplateText size={14} semiBold>
                                                {t('challenges.details.addEntry')}
                                            </TemplateText>
                                        </TemplateBox>
                                    )}
                                </TemplateBox>
                                <TemplateText size={14} color={METAL} mb={20}>
                                    {submissions?.length > 0
                                        ? t('challenges.details.yourEntriesDescription')
                                        : t('challenges.details.showOffDescription')}
                                </TemplateText>
                            </TemplateBox>
                            {submissions?.length === 0 ? (
                                <TemplateBox justifyContent="center" alignItems="center" mt={100}>
                                    <TemplateText size={16} color={BLACK_SECONDARY} mb={30}>
                                        {t('challenges.details.startChallenge')}
                                    </TemplateText>
                                    <Button
                                        title={t('challenges.details.submitEntry')}
                                        height={50}
                                        width={SCREEN_WIDTH - 40}
                                        color={BLACK}
                                        onPress={() => setIsEntriesModalVisible(true)}
                                        loading={savingEntry}
                                    />
                                </TemplateBox>
                            ) : (
                                <TemplateBox justifyContent="center" alignItems="center">
                                    {submissions?.map(submission => (
                                        <ChallengeEntryCard
                                            key={submission.id}
                                            entry={submission}
                                            onEdit={() => {
                                                startEditEntry(submission);
                                                setTimeout(() => {
                                                    setIsEntriesModalVisible(true);
                                                }, 300);
                                            }}
                                        />
                                    ))}
                                </TemplateBox>
                            )}
                        </TemplateBox>
                    )}
                </TemplateBox>
            )}
            {activeTab !== TOGGLE_TABS[3] && (
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
                        onPress={onCtaPress}
                        disabled={enrollButtonDisabled}
                        loading={enrollmentLoading || enrolling}
                    />
                </TemplateBox>
            )}
            <ChallengeSubmissionModal
                visible={isEntriesModalVisible}
                closeOnPress={() => {
                    setIsEntriesModalVisible(false);
                    resetEntryForm();
                }}
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                metricsForm={metricsForm}
                handleMetricChange={handleMetricChange}
                onSave={handleSaveEntry}
                saving={savingEntry}
            />
            <ChallengeLeaderBoardModal
                visible={isLeaderBoardModalVisible}
                closeOnPress={() => setIsLeaderBoardModalVisible(false)}
                leaderBoardEntries={leaderBoardEntries}
                topEntry={topEntry}
                loading={leaderBoardEntriesLoading}
            />
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    scrollViewMain: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
});
export default ChallengeDetailsScreen;
