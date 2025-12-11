import { BriefPoint, Challenge, ShortDescriptionSegment } from './useChallenge';
import { buildThreeWeekChallengeDates, createChallenge } from './useCreateChallenge';

function kegelShortDescription(): ShortDescriptionSegment[] {
    return [
        {
            text: 'Create short vertical videos that make pelvic floor training feel normal, discreet, and doable in minutes a day.',
            bold: false,
        },
        {
            text: 'Show how The Kegel App guides users with clear squeeze and relax cues, streaks, and progress tracking.',
            bold: true,
        },
        {
            text: 'Drive installs for The Kegel App by adding the download link in every caption or your bio.',
            bold: false,
        },
    ];
}

function kegelHowToParticipate(): BriefPoint[] {
    return [
        {
            title: 'Show real life moments',
            description:
                'Film simple everyday situations where a stronger pelvic floor helps, like laughing, jumping, running, or sneezing. Keep it safe for work.',
        },
        {
            title: 'Introduce The Kegel App',
            description:
                'In one or two lines, explain how the app guides Kegels with clear cues, streaks, and reminders so users do not have to guess.',
        },
        {
            title: 'Add a clear call to action',
            description:
                'Tell viewers to download The Kegel App using the link in your caption or bio. Keep the call to action short and direct.',
        },
    ];
}

function kegelRules(): string[] {
    return [
        'Include the official The Kegel App download link in every participating video caption or keep it in your bio during the challenge.',
        'Do not make medical claims, cures, or guarantees. Focus on routines, strength, and consistency instead of diagnoses or treatments.',
        'No explicit sexual content, nudity, or graphic demonstrations. Keep tone respectful, body positive, and safe for work.',
        'Do not mock or shame people who experience pelvic floor issues. Avoid content that could embarrass real users.',
        'Use only footage, audio, and edits you have rights to. No copyright violations or unlicensed music.',
    ];
}

function kegelPrizes(): Challenge['prizes'] {
    return {
        grandPrize:
            '$500 cash for the top performer based on verified views plus how well the story fits The Kegel App brand.',
        runnersUp:
            '4 runners up each receive $125 cash for strong performance, on brief content, and clear call to action.',
        allParticipants: 'Challenge badge inside UGCCreatorApp and early access to future health and wellness briefs.',
    };
}

/**
 * Call this once to seed the Kegel challenge.
 * You can pass a custom enrollment start date if needed.
 */
export async function createKegelChallenge(enrollmentStartDate?: Date) {
    const start = enrollmentStartDate || new Date(); // now
    const { enrollmentStartAt, enrollmentEndAt, challengeStartAt, challengeEndAt } =
        buildThreeWeekChallengeDates(start);

    const id = 'three_week_kegel_app_video_challenge';

    const brief: Challenge['brief'] = {
        mission:
            'Help more people discover The Kegel App by creating short, friendly videos that show how easy it is to train the pelvic floor a few minutes a day.',
        disqualificationRule:
            'Creators will be disqualified if they skip the download link, make medical claims, or post explicit or offensive content around pelvic floor health.',
        howToParticipate: kegelHowToParticipate(),
    };

    const newId = await createChallenge({
        id,
        title: '3 Week Pelvic Strength Video Challenge',
        status: 'upcoming', // or leave undefined to auto derive
        prizePoolUsd: 1000,
        enrollmentStartAt,
        enrollmentEndAt,
        challengeStartAt,
        challengeEndAt,
        shortDescriptionSegments: kegelShortDescription(),
        brief,
        rules: kegelRules(),
        prizes: kegelPrizes(),
    });

    return newId;
}
