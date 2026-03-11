const functions = require('firebase-functions');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const { sendBatchNotifications, getCreatorsWithTokens, pickRandom } = require('../helpers/fcm');

const platformBrandsData = require('../platformBrands.json');
const PLATFORM_BRANDS = platformBrandsData.brands.map(brand => brand.name);

const BRANDS_CATALOGUE_MESSAGES = [
    {
        title: (name, brands) => `Hey ${name}, check out ${brands[0]}! 👀`,
        body: (name, brands) => `${brands[0]} just joined the platform and they're looking for creators like you.`,
    },
    {
        title: (name, brands) => `${name}, ${brands[0]} wants creators 🔥`,
        body: (name, brands) =>
            `Brands like ${brands[0]} and ${brands[1]} are on the platform. Your next collab is waiting!`,
    },
    {
        title: name => `${name}, new brands are here for you!`,
        body: (name, brands) => `${brands[0]}, ${brands[1]} & more are looking for UGC creators. Take a look!`,
    },
];

const BRANDS_HIRING_MESSAGES = [
    {
        title: (name, brandName) => `${name}, ${brandName} is hiring! 💰`,
        body: () => `They need a UGC creator ASAP. Could be your next paycheck!`,
    },
    {
        title: (name, brandName, count) => `Hey ${name}, ${count} brand${count > 1 ? 's' : ''} want you 🚀`,
        body: (name, brandName) => `${brandName} and others are actively hiring creators. Don't let this one slip!`,
    },
    {
        title: name => `${name}, someone's getting paid 💸`,
        body: (name, brandName) => `${brandName} is looking for creators right now. Apply before spots fill up!`,
    },
];

const CHALLENGES_MESSAGES = [
    {
        title: (name, prize) => `${name}, win up to $${prize}! 🏆`,
        body: (name, challengeTitle) => `${challengeTitle} is live — show off your skills and take home the prize!`,
    },
    {
        title: name => `Hey ${name}, you in? 🎬`,
        body: (name, challengeTitle, prize) =>
            `${challengeTitle} — $${prize} in prizes. Creators are already competing!`,
    },
    {
        title: name => `${name}, don't sit this one out 👀`,
        body: (name, challengeTitle, prize) =>
            `${challengeTitle} has $${prize} up for grabs. Jump in and show what you've got!`,
    },
];

const SCHEDULE_CONFIG = {
    retryCount: 3,
    memory: '1GiB',
    timeoutSeconds: 300,
    timeZone: 'Europe/Berlin',
};

// Schedule: every 3 days at 10 AM ET — Brands Catalogue
exports.scheduledBrandsCatalogueNotification = onSchedule(
    { ...SCHEDULE_CONFIG, schedule: '0 10 */3 * *' },
    async () => {
        try {
            const creators = await getCreatorsWithTokens();
            if (creators.length === 0) {
                functions.logger.info('No creators with FCM tokens found. Skipping brands catalogue notification.');
                return;
            }

            const template = BRANDS_CATALOGUE_MESSAGES[Math.floor(Math.random() * BRANDS_CATALOGUE_MESSAGES.length)];

            await sendBatchNotifications(
                creators,
                userName => {
                    const name = userName || 'Creator';
                    const brands = pickRandom(PLATFORM_BRANDS, 2);
                    return { title: template.title(name, brands), body: template.body(name, brands) };
                },
                { type: 'brands_catalogue' },
            );

            functions.logger.info(`Brands catalogue notification sent to ${creators.length} creators.`);
        } catch (err) {
            functions.logger.error('scheduledBrandsCatalogueNotification failed:', err);
        }
    },
);

// Schedule: every 3 days at 2 PM ET — Brands Hiring
exports.scheduledBrandsHiringNotification = onSchedule({ ...SCHEDULE_CONFIG, schedule: '0 14 */3 * *' }, async () => {
    try {
        const projectsSnapshot = await admin
            .firestore()
            .collection('projects')
            .where('isBlocked', '==', false)
            .select('brandName', 'title')
            .get();

        if (projectsSnapshot.empty) {
            functions.logger.info('No active projects found. Skipping brands hiring notification.');
            return;
        }

        const projects = projectsSnapshot.docs.map(doc => doc.data());
        const projectCount = projects.length;

        const creators = await getCreatorsWithTokens();
        if (creators.length === 0) {
            functions.logger.info('No creators with FCM tokens found. Skipping brands hiring notification.');
            return;
        }

        const template = BRANDS_HIRING_MESSAGES[Math.floor(Math.random() * BRANDS_HIRING_MESSAGES.length)];

        await sendBatchNotifications(
            creators,
            userName => {
                const name = userName || 'Creator';
                const randomProject = projects[Math.floor(Math.random() * projects.length)];
                const brandName = randomProject.brandName || randomProject.title || 'A brand';
                return {
                    title: template.title(name, brandName, projectCount),
                    body: template.body(name, brandName, projectCount),
                };
            },
            { type: 'brands_hiring' },
        );

        functions.logger.info(
            `Brands hiring notification sent to ${creators.length} creators (${projectCount} active projects).`,
        );
    } catch (err) {
        functions.logger.error('scheduledBrandsHiringNotification failed:', err);
    }
});

// Schedule: every 3 days at 6 PM ET — Challenges
exports.scheduledChallengesNotification = onSchedule({ ...SCHEDULE_CONFIG, schedule: '0 18 */3 * *' }, async () => {
    try {
        const now = admin.firestore.Timestamp.now();
        const challengesSnapshot = await admin
            .firestore()
            .collection('challenges')
            .where('challengeEndAt', '>', now)
            .orderBy('challengeEndAt', 'asc')
            .select('title', 'status', 'prizePoolUsd', 'challengeEndAt')
            .get();

        const activeChallenges = challengesSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(c => ['upcoming', 'enrollment', 'active'].includes(c.status));

        if (activeChallenges.length === 0) {
            functions.logger.info('No active challenges found. Skipping challenges notification.');
            return;
        }

        const creators = await getCreatorsWithTokens();
        if (creators.length === 0) {
            functions.logger.info('No creators with FCM tokens found. Skipping challenges notification.');
            return;
        }

        const template = CHALLENGES_MESSAGES[Math.floor(Math.random() * CHALLENGES_MESSAGES.length)];

        await sendBatchNotifications(
            creators,
            userName => {
                const name = userName || 'Creator';
                const challenge = activeChallenges[Math.floor(Math.random() * activeChallenges.length)];
                const prize = challenge.prizePoolUsd || 0;
                const challengeTitle = challenge.title || 'New Challenge';
                return {
                    title: template.title(name, prize),
                    body: template.body(name, challengeTitle, prize),
                };
            },
            { type: 'challenge' },
        );

        functions.logger.info(
            `Challenges notification sent to ${creators.length} creators (${activeChallenges.length} active challenges).`,
        );
    } catch (err) {
        functions.logger.error('scheduledChallengesNotification failed:', err);
    }
});
