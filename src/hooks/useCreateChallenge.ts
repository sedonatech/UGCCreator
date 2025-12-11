import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Challenge, ShortDescriptionSegment } from './useChallenge';

type FireTs = FirebaseFirestoreTypes.Timestamp;
type DateOrTs = Date | FireTs;

export type ChallengeCreateInput = {
    id?: string;
    title: string;

    // optional: if omitted we derive from dates
    status?: string;

    prizePoolUsd: number;

    enrollmentStartAt: DateOrTs;
    enrollmentEndAt: DateOrTs;
    challengeStartAt: DateOrTs;
    challengeEndAt: DateOrTs;

    shortDescriptionSegments: ShortDescriptionSegment[];

    brief: Challenge['brief'];
    rules: string[];
    prizes: Challenge['prizes'];
};

function toTimestamp(value: DateOrTs): FireTs {
    if (value instanceof Date) {
        return firestore.Timestamp.fromDate(value) as FireTs;
    }
    return value;
}

function deriveStatusFromDates(input: ChallengeCreateInput): string {
    const nowMs = Date.now();
    const enrollmentStartMs = toTimestamp(input.enrollmentStartAt).toMillis();
    const enrollmentEndMs = toTimestamp(input.enrollmentEndAt).toMillis();
    const challengeStartMs = toTimestamp(input.challengeStartAt).toMillis();
    const challengeEndMs = toTimestamp(input.challengeEndAt).toMillis();

    if (nowMs < enrollmentStartMs) return 'upcoming';
    if (nowMs >= enrollmentStartMs && nowMs < enrollmentEndMs) return 'enrollment';
    if (nowMs >= enrollmentEndMs && nowMs < challengeEndMs) return 'active';
    return 'completed';
}

/**
 * Generic helper to create a Challenge document.
 * Pass only copy + dates, it handles id, timestamps, and participantCount.
 */
export async function createChallenge(input: ChallengeCreateInput) {
    const collection = firestore().collection('challenges');

    const id = input.id || collection.doc().id;

    const enrollmentStartAt = toTimestamp(input.enrollmentStartAt);
    const enrollmentEndAt = toTimestamp(input.enrollmentEndAt);
    const challengeStartAt = toTimestamp(input.challengeStartAt);
    const challengeEndAt = toTimestamp(input.challengeEndAt);

    const status = input.status || deriveStatusFromDates(input);

    const challenge: Challenge = {
        id,
        title: input.title,
        status,
        prizePoolUsd: input.prizePoolUsd,
        participantCount: 0,
        enrollmentStartAt,
        enrollmentEndAt,
        challengeStartAt,
        challengeEndAt,
        shortDescriptionSegments: input.shortDescriptionSegments,
        brief: input.brief,
        rules: input.rules,
        prizes: input.prizes,
    };

    await collection.doc(id).set(challenge);
    return id;
}

/**
 * Helper to build a standard 1 week enrollment + 3 week challenge window.
 * You can reuse this for all 3 week challenges.
 */
export function buildThreeWeekChallengeDates(
    enrollmentStart: Date,
    enrollmentDays = 7,
    challengeDays = 21,
): {
    enrollmentStartAt: Date;
    enrollmentEndAt: Date;
    challengeStartAt: Date;
    challengeEndAt: Date;
} {
    const enrollmentStartAt = enrollmentStart;
    const enrollmentEndAt = new Date(enrollmentStartAt.getTime() + enrollmentDays * 24 * 60 * 60 * 1000);
    const challengeStartAt = enrollmentEndAt;
    const challengeEndAt = new Date(challengeStartAt.getTime() + challengeDays * 24 * 60 * 60 * 1000);

    return {
        enrollmentStartAt,
        enrollmentEndAt,
        challengeStartAt,
        challengeEndAt,
    };
}
