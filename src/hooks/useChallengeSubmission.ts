import { useEffect, useState } from 'react';
import { ChallengeSubmission } from './useChallenge';
import firestore from '@react-native-firebase/firestore';

export const useChallengeSubmission = (challengeId?: string, userId?: string) => {
    const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);

    useEffect(() => {
        if (!challengeId || !userId) {
            setSubmissions([]);
            setSubmissionsLoading(false);
            return;
        }

        const entriesRef = firestore()
            .collection('challenges')
            .doc(challengeId)
            .collection('submissions') // Firestore collection, UI will call them "entries"
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc');
        console.log('🚀 ~ useChallengeSubmission ~ entriesRef:', entriesRef);

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

    return { submissions, submissionsLoading };
};
