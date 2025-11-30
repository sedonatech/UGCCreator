import { useEffect, useState } from 'react';
import { ChallengeMetrics, ChallengeSubmission } from './useChallenge';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type ChallengeLeaderboardEntry = {
    id: string;
    challengeId: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    videoUrl: string;
    metrics: ChallengeMetrics;
    createdAt: FirebaseFirestoreTypes.Timestamp | null;
    points: number;
    position: number;
};

export const calculateMetricsPoints = (metrics: ChallengeMetrics): number => {
    if (!metrics) {
        return 0;
    }

    const views = Number(metrics.views) || 0;
    const likes = Number(metrics.likes) || 0;
    const comments = Number(metrics.comments) || 0;
    const shares = Number(metrics.shares) || 0;
    const saves = Number(metrics.saves) || 0;

    return views + likes + comments + shares + saves;
};

export const useChallengeSubmission = (challengeId?: string, userId?: string) => {
    const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);

    const [leaderBoardEntries, setLeaderBoardEntries] = useState<ChallengeLeaderboardEntry[]>([]);
    const [leaderBoardEntriesLoading, setLeaderBoardEntriesLoading] = useState(true);

    useEffect(() => {
        if (!challengeId || !userId) {
            setSubmissions([]);
            setSubmissionsLoading(false);
            return;
        }

        const entriesRef = firestore()
            .collection('challenges')
            .doc(challengeId)
            .collection('submissions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc');

        const unsubscribe = entriesRef.onSnapshot(
            querySnapshot => {
                const list: ChallengeSubmission[] = [];
                querySnapshot.forEach(doc => {
                    const data = doc.data() as ChallengeSubmission;
                    list.push({
                        id: doc.id,
                        ...data,
                    });
                });
                setSubmissions(list);
                setSubmissionsLoading(false);
            },
            error => {
                console.error('Error loading challenge entries:', error);
                setSubmissions([]);
                setSubmissionsLoading(false);
            },
        );

        return () => unsubscribe();
    }, [challengeId, userId]);

    useEffect(() => {
        if (!challengeId) {
            setLeaderBoardEntries([]);
            setLeaderBoardEntriesLoading(false);
            return;
        }

        const submissionsRef = firestore().collection('challenges').doc(challengeId).collection('submissions');

        const unsubscribe = submissionsRef.onSnapshot(
            querySnapshot => {
                const list: ChallengeLeaderboardEntry[] = [];

                querySnapshot.forEach(doc => {
                    const data = doc.data() as ChallengeSubmission;

                    const points = calculateMetricsPoints(data.metrics);

                    list.push({
                        id: doc.id,
                        challengeId: data.challengeId,
                        userId: data.userId,
                        userName: data.userName,
                        userEmail: data.userEmail,
                        videoUrl: data.videoUrl,
                        metrics: data.metrics,
                        createdAt: data.createdAt ?? null,
                        points,
                        position: 0, // placeholder, will set after sorting
                    });
                });

                // sort by points descending, then by createdAt ascending as a tiebreaker
                list.sort((a, b) => {
                    if (b.points !== a.points) {
                        return b.points - a.points;
                    }

                    const aTime = a.createdAt ? a.createdAt.toMillis() : 0;
                    const bTime = b.createdAt ? b.createdAt.toMillis() : 0;
                    return aTime - bTime;
                });

                // assign positions
                const withPositions = list.map((entry, index) => ({
                    ...entry,
                    position: index + 1,
                }));

                setLeaderBoardEntries(withPositions);
                setLeaderBoardEntriesLoading(false);
            },
            error => {
                console.error('Error loading challenge leaderboard:', error);
                setLeaderBoardEntries([]);
                setLeaderBoardEntriesLoading(false);
            },
        );

        return () => unsubscribe();
    }, [challengeId]);

    const topEntry = leaderBoardEntries.length > 0 ? leaderBoardEntries[0] : null;

    return { submissions, submissionsLoading, leaderBoardEntries, topEntry, leaderBoardEntriesLoading };
};
