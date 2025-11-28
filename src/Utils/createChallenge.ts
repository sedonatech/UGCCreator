import firestore from '@react-native-firebase/firestore';

export async function createInitialChallenge() {
    const challengesRef = firestore().collection('challenges');

    // pick a fixed id so you can target it easily
    const docRef = challengesRef.doc('viral-sprint-3-week');

    await docRef.set({
        title: '3 Week Video Challenge',
        status: 'upcoming', // you can update this later if needed

        // enrollment 1–7 December, challenge 8–29 December (example)
        enrollmentStartAt: new Date('2025-12-01T00:00:00.000Z'),
        enrollmentEndAt: new Date('2025-12-07T23:59:59.000Z'),
        challengeStartAt: new Date('2025-12-08T00:00:00.000Z'),
        challengeEndAt: new Date('2025-12-29T23:59:59.000Z'),

        prizePoolUsd: 300,
        participantCount: 0,

        brief: {
            mission:
                'Create short TikTok videos that showcase UGCCreatorApp, drive installs through your link, and prove you can move real numbers as a UGC creator.',
            howToParticipate: [
                {
                    title: 'Create',
                    description:
                        'Record short TikTok videos that clearly show or talk about UGCCreatorApp, what it does for creators, and why it is useful.',
                },
                {
                    title: 'Post',
                    description:
                        'Publish your videos on TikTok and add the UGCCreatorApp store link in your caption or bio so people can tap through.',
                },
                {
                    title: 'Track',
                    description:
                        'Monitor your metrics for each video. At minimum you track views, likes, comments, shares, saves, and link clicks.',
                },
                {
                    title: 'Update weekly',
                    description:
                        'Once a week, open the challenge in the app, pick each video, paste the TikTok URL, and update the latest numbers for all required metrics.',
                },
                {
                    title: 'Final upload',
                    description:
                        'On the final submission day, you enter your latest metrics one last time for each video.',
                },
                {
                    title: 'Winner selection',
                    description:
                        'The brand reviews your links, metrics, and screenshots, verifies the numbers, and compares all creators. The strongest performing video wins, with additional prizes for the top ten overall.',
                },
            ],
        },

        rules: [
            'You must enroll inside UGCCreatorApp during the enrollment week, add your TikTok handle, and have an active account.',
            'Only TikTok videos count. Each video must feature UGCCreatorApp and include the app download link in your caption or bio.',
            'You can post multiple videos during the 3 week challenge, but only videos posted within the official dates and added in the app with a valid TikTok URL are eligible.',
            'For each submitted video you track views, likes, comments, shares, saves, and, if available, link clicks. You update these numbers in the app at least once per week.',
            'On the final submission day you choose which videos you submit, enter your latest metrics, and upload clear screenshots as proof. After you submit, you cannot edit anything.',
            'Winners are chosen based on the performance of individual videos, using the submitted and verified metrics. The brand selects the top five videos and its decision is final.',
            'The brand can request extra proof, exclude entries if numbers do not match TikTok, and disqualify creators for fake engagement or misleading data.',
            'You keep rights to your content. You can later request a reasonable usage rights offer if your videos gain traction, and the brand may send paid usage rights offers for high performing entries.',
        ],

        prizes: {
            grandPrize: 'Cash prizes up to 300 USD shared across the top 10 creators.',
            runnersUp: 'Rewards scale by position, from first place down to tenth.',
            allParticipants:
                'High performing videos can earn extra. You can request a separate usage rights fee from the brand after the challenge, even if you do not win.',
        },

        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

type ShortDescriptionSegment = {
    text: string;
    bold: boolean;
};

const buildShortDescriptionSegments = (): ShortDescriptionSegment[] => {
    return [
        {
            text: 'A three week push where you ',
            bold: false,
        },
        {
            text: 'post short videos, add our app download link',
            bold: true,
        },
        {
            text: ', and compete to land in the ',
            bold: false,
        },
        {
            text: 'top 10 for cash rewards!',
            bold: true,
        },
    ];
};

export const setChallengeShortDescription = async (challengeId: string) => {
    const challengeRef = firestore().collection('challenges').doc(challengeId);

    await challengeRef.set(
        {
            shortDescriptionSegments: buildShortDescriptionSegments(),
        },
        { merge: true },
    );
};
