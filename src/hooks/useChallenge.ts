import { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export type ChallengeParticipant = {
    challengeId: string;
    userId: string;
    userEmail?: string;
    userName?: string;
    enrolledAt: FirebaseFirestoreTypes.Timestamp | null;
    status: 'enrolled' | 'active' | 'submitted' | 'disqualified' | 'winner';
};

export type ChallengeMetrics = {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    title?: string;
};

export type ChallengeSubmission = {
    id?: string;
    challengeId: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    videoUrl: string;
    metrics: ChallengeMetrics;
    createdAt: FirebaseFirestoreTypes.Timestamp | null;
    updatedAt: FirebaseFirestoreTypes.Timestamp | null;
};

export type ShortDescriptionSegment = {
    text: string;
    bold: boolean;
};

export type BriefPoint = {
    title: string;
    description: string;
};

export type Challenge = {
    id: string;
    title: string;
    status: string;
    prizePoolUsd: number;
    participantCount: number;
    enrollmentStartAt: FirebaseFirestoreTypes.Timestamp;
    enrollmentEndAt: FirebaseFirestoreTypes.Timestamp;
    challengeStartAt: FirebaseFirestoreTypes.Timestamp;
    challengeEndAt: FirebaseFirestoreTypes.Timestamp;
    shortDescriptionSegments: ShortDescriptionSegment[];
    brief: {
        mission: string;
        disqualificationRule: string;
        howToParticipate: BriefPoint[];
        productName?: string;
        links: {
            appStoreUrl?: string;
            playStoreUrl?: string;
            website?: string;
        };
        about?: string;
    };
    rules: string[];
    prizes: {
        grandPrize: string;
        runnersUp: string;
        allParticipants: string;
    };
};
type EnrollParams = {
    challengeId: string;
    userId: string;
    userEmail?: string;
    userName?: string;
};
type ChallengeCtaParams = {
    enrollmentStartAt?: Date | null;
    challengeStartAt?: Date | null;
    challengeEndAt?: Date | null;
    now: Date;
    isEnrolled: boolean | Promise<() => boolean>;
};
type ChallengeCtaResult = {
    title: string;
    disabled: boolean;
};

const useChallenge = () => {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [challengeLoading, setChallengeLoading] = useState(true);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    console.log('🚀 ~ useChallenge ~ challenges:', challenges);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('challenges')
            .orderBy('challengeStartAt', 'asc')
            .onSnapshot(querySnapshot => {
                if (querySnapshot.empty) {
                    setChallenge(null);
                    setChallenges([]);
                    setChallengeLoading(false);
                    return;
                }

                const all: Challenge[] = [];

                querySnapshot.forEach(doc => {
                    const data = doc.data() as any;

                    const shortDescriptionSegments: ShortDescriptionSegment[] = data.shortDescriptionSegments ?? [];

                    const mapped: Challenge = {
                        id: doc.id,
                        title: data.title,
                        status: data.status,
                        prizePoolUsd: data.prizePoolUsd,
                        participantCount: data.participantCount,
                        enrollmentStartAt: data.enrollmentStartAt,
                        enrollmentEndAt: data.enrollmentEndAt,
                        challengeStartAt: data.challengeStartAt,
                        challengeEndAt: data.challengeEndAt,
                        shortDescriptionSegments,
                        brief: {
                            mission: data.brief?.mission,
                            disqualificationRule: data.brief?.disqualificationRule,
                            howToParticipate: data.brief?.howToParticipate,
                            productName: data.brief?.productName,
                            links: data.brief?.links || {},
                            about: data.brief?.about,
                        },
                        rules: data.rules,
                        prizes: data.prizes,
                    };

                    all.push(mapped);
                });

                setChallenges(all);
                setChallenge(all[0] ?? null);
                setChallengeLoading(false);
            });

        return () => unsubscribe();
    }, []);

    const getStatusLabel = (
        enrollmentStartAt?: Date | null,
        challengeStartAt?: Date | null,
        challengeEndAt?: Date | null,
        now: Date = new Date(),
    ): string => {
        if (!enrollmentStartAt || !challengeStartAt || !challengeEndAt) {
            return '';
        }

        const nowMs = now.getTime();
        const enrollStartMs = enrollmentStartAt.getTime();
        const challengeStartMs = challengeStartAt.getTime();
        const challengeEndMs = challengeEndAt.getTime();

        // before enrollment
        if (nowMs < enrollStartMs) {
            const diffDays = Math.ceil((enrollStartMs - nowMs) / MS_PER_DAY);
            if (diffDays <= 0) {
                return 'Enrollment starts today';
            }
            if (diffDays === 1) {
                return '1 day to enrollment';
            }
            return `${diffDays} days to enrollment`;
        }

        // enrollment open, before challenge start and before end
        if (nowMs >= enrollStartMs && nowMs < challengeStartMs && nowMs < challengeEndMs) {
            return 'Enrollment open';
        }

        // challenge active
        if (nowMs >= challengeStartMs && nowMs <= challengeEndMs) {
            return 'Challenge started';
        }

        // after challenge end
        if (nowMs > challengeEndMs) {
            return 'Challenge completed';
        }

        return '';
    };

    const canEnrollNow = (
        enrollmentStartAt?: Date | null,
        challengeEndAt?: Date | null,
        now: Date = new Date(),
    ): boolean => {
        if (!enrollmentStartAt || !challengeEndAt) {
            return false;
        }

        const nowMs = now.getTime();
        const enrollStartMs = enrollmentStartAt.getTime();
        const challengeEndMs = challengeEndAt.getTime();

        // allowed from enrollment start until challenge end
        return nowMs >= enrollStartMs && nowMs <= challengeEndMs;
    };

    const getEndsInLabel = (challengeEndAt?: Date | null, now: Date = new Date()): string => {
        if (!challengeEndAt) {
            return '';
        }

        const diffMs = challengeEndAt.getTime() - now.getTime();
        if (diffMs <= 0) {
            return 'Ended';
        }

        const diffDays = Math.ceil(diffMs / MS_PER_DAY);
        if (diffDays === 1) {
            return 'Ends in 1 day';
        }
        return `Ends in ${diffDays} days`;
    };

    return { challenge, challenges, challengeLoading, getStatusLabel, canEnrollNow, getEndsInLabel };
};

export default useChallenge;

/**
 * Create or update a participant document so the user is enrolled.
 * Uses a fixed document id = userId under `challenges/{challengeId}/participants/{userId}`.
 */
export async function enrollInChallenge(params: {
    challengeId: string;
    userId: string;
    userName?: string;
    userEmail?: string;
}) {
    try {
        const { challengeId, userId, userName, userEmail } = params;
        const challengeRef = firestore().collection('challenges').doc(challengeId);
        const participantRef = firestore()
            .collection('challenges')
            .doc(challengeId)
            .collection('participants')
            .doc(userId);
        await participantRef.set(
            {
                challengeId,
                userId,
                userName,
                userEmail,
                enrolledAt: firestore.FieldValue.serverTimestamp(),
                status: 'enrolled',
            },
            { merge: true },
        );

        await challengeRef.update({
            participantCount: firestore.FieldValue.increment(1),
        });
    } catch (error) {
        console.error('Error enrolling in challenge:', error);
        throw error;
    }
}

/**
 * Create or update a single video submission.
 * If submissionId is provided we update that doc, else we create a new one.
 * Each submission holds metrics for one video link so you can update metrics later.
 */
export async function upsertChallengeSubmission(params: {
    challengeId: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    videoUrl: string;
    metrics: ChallengeMetrics;
    submissionId?: string;
}) {
    try {
        const { challengeId, userId, userName, userEmail, videoUrl, metrics, submissionId } = params;
        const submissionsRef = firestore().collection('challenges').doc(challengeId).collection('submissions');
        const docRef = submissionId ? submissionsRef.doc(submissionId) : submissionsRef.doc();
        await docRef.set(
            {
                challengeId,
                userId,
                videoUrl,
                userName,
                userEmail,
                metrics,
                updatedAt: firestore.FieldValue.serverTimestamp(),
                // createdAt is only set the first time
                ...(submissionId
                    ? {}
                    : {
                          createdAt: firestore.FieldValue.serverTimestamp(),
                      }),
            },
            { merge: true },
        );

        return docRef.id;
    } catch (error) {
        console.error('Error upserting challenge submission:', error);
        throw error;
    }
}

export async function isUserEnrolledInChallenge({ challengeId, userId }: EnrollParams) {
    const participantRef = firestore().collection('challenges').doc(challengeId).collection('participants').doc(userId);

    const snapshot = await participantRef.get();
    return snapshot.exists;
}

export function getChallengeCta({
    enrollmentStartAt,
    challengeStartAt,
    challengeEndAt,
    now,
    isEnrolled,
}: ChallengeCtaParams): ChallengeCtaResult {
    if (!enrollmentStartAt || !challengeStartAt || !challengeEndAt) {
        return { title: 'Coming Soon', disabled: true };
    }

    const nowMs = now.getTime();
    const enrollStartMs = enrollmentStartAt.getTime();
    const challengeStartMs = challengeStartAt.getTime();
    const challengeEndMs = challengeEndAt.getTime();

    const isBeforeEnrollment = nowMs < enrollStartMs;
    const isAfterChallenge = nowMs > challengeEndMs;
    const isEnrollmentOpen = nowMs >= enrollStartMs && nowMs <= challengeEndMs;
    const isChallengeStarted = nowMs >= challengeStartMs;

    // 1) Enrollment not open yet
    if (isBeforeEnrollment) {
        return { title: 'Coming Soon', disabled: true };
    }

    // 2) Challenge already finished
    if (isAfterChallenge) {
        return { title: 'Challenge Completed', disabled: true };
    }

    // From here, enrollment is open (between enrollmentStart and challengeEnd)

    // 3) Enrollment open and user not enrolled
    if (!isEnrolled && isEnrollmentOpen) {
        return { title: 'Enroll Now', disabled: false };
    }

    // 4) User enrolled and challenge started
    if (isEnrolled && isChallengeStarted) {
        return { title: 'Submit Entries', disabled: false };
    }

    // 5) User enrolled, challenge not started yet
    if (isEnrolled && !isChallengeStarted) {
        const diffMs = challengeStartMs - nowMs;
        const diffDays = Math.max(1, Math.ceil(diffMs / MS_PER_DAY));
        const daysText = diffDays === 1 ? '1 day' : `${diffDays} days`;
        return { title: `Challenge starts in ${daysText}`, disabled: true };
    }

    // Fallback
    return { title: 'Coming Soon', disabled: true };
}
