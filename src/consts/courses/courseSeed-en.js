import { COURSE_THEME_1, COURSE_THEME_2, COURSE_THEME_3 } from './courseThemeColors';

const buildNextMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
};

const buildTasksForTitle = title => [
    {
        title: `Learn ${title}`,
        description: `Spend 20 minutes studying ${title.toLowerCase()}. Write down three takeaways you can apply today.`,
        tag: 'Learn',
        durationMinutes: 20,
    },
    {
        title: `Apply ${title}`,
        description: `Complete a focused exercise that puts ${title.toLowerCase()} into practice with a real product or mock brief.`,
        tag: 'Action',
        durationMinutes: 30,
    },
    {
        title: `Create a deliverable`,
        description: `Draft a small asset that proves you can execute ${title.toLowerCase()} (notes, checklist, or short clip).`,
        tag: 'Build',
        durationMinutes: 25,
    },
    {
        title: 'Review and reflect',
        description: 'Score your output on clarity, quality, and speed. Note one improvement for tomorrow.',
        tag: 'Review',
        durationMinutes: 10,
    },
];

const buildDays = (dayTitles, weekTitles, weekTips) =>
    dayTitles.map((title, index) => {
        const day = index + 1;
        const weekIndex = Math.floor(index / 7);
        return {
            day,
            title,
            summary: `Day ${day} focuses on ${title.toLowerCase()}.`,
            weekTitle: weekTitles[weekIndex] || weekTitles[weekTitles.length - 1],
            tip: weekTips[weekIndex] || weekTips[weekTips.length - 1],
            tasks: buildTasksForTitle(title),
        };
    });

const UGC_DAY_TITLES = [
    'Orientation and goals',
    'Creator mindset and habits',
    'Define your niche',
    'Audience research',
    'Brand research',
    'Content style audit',
    'Build your creator statement',
    'Gear and setup basics',
    'Lighting and audio basics',
    'Filming with a phone',
    'Shooting b-roll',
    'Editing workflow',
    'Scriptwriting basics',
    'Hook formulas',
    'CTA and structure',
    'Portfolio planning',
    'Create three sample videos',
    'Create three sample photos',
    'Build your media kit',
    'Pricing and packages',
    'Outreach list building',
    'Cold pitch framework',
    'Follow-up system',
    'Negotiation basics',
    'Contract essentials',
    'Delivery process',
    'Client communication',
    'Performance metrics',
    'Scale with batching',
    '30-day review and next plan',
];

const NEGOTIATION_DAY_TITLES = [
    'Deal landscape overview',
    'Value positioning',
    'Rate card strategy',
    'Pricing psychology',
    'Negotiation prep checklist',
    'Discovery call framework',
    'Research brand budgets',
    'Define non-negotiables',
    'Build a proposal outline',
    'Scope and deliverables',
    'Usage rights and licensing',
    'Exclusivity clauses',
    'Whitelisting and ads usage',
    'Revisions policy',
    'Payment terms',
    'Taxes and invoicing',
    'Email negotiation scripts',
    'Objection handling',
    'Bundling and upsells',
    'Timeline negotiation',
    'Contract red flags',
    'Legal basics for creators',
    'Negotiation role-play',
    'Closing techniques',
    'Relationship building',
    'Renewals and retainers',
    'Protecting boundaries',
    'Case study creation',
    'Increase average deal size',
    'Negotiation review and playbook',
];

const PRODUCTION_DAY_TITLES = [
    'Production workflow overview',
    'Pre-production planning',
    'Storyboards and shot lists',
    'Location scouting',
    'Set design and props',
    'Camera settings',
    'Framing and composition',
    'Natural lighting mastery',
    'Artificial lighting setups',
    'Audio recording best practices',
    'Shooting product demos',
    'Shooting testimonial style',
    'Shooting lifestyle scenes',
    'Movement and transitions',
    'B-roll variety',
    'Editing for pace',
    'Color correction basics',
    'Sound design',
    'Text overlays and captions',
    'Platform formatting',
    'Thumbnail and cover design',
    'Quality control checklist',
    'File organization and backups',
    'Collaboration with brands',
    'Batch production day',
    'Repurposing assets',
    'Advanced editing techniques',
    'A/B testing creative',
    'Performance analysis',
    'Production playbook and scale',
];

const UGC_WEEK_TITLES = [
    'Week 1: Foundations',
    'Week 2: Production Basics',
    'Week 3: Portfolio and Pricing',
    'Week 4: Outreach and Delivery',
    'Week 5: Scale and Review',
];

const NEGOTIATION_WEEK_TITLES = [
    'Week 1: Value and Preparation',
    'Week 2: Deal Structure',
    'Week 3: Negotiation Skills',
    'Week 4: Contracts and Closing',
    'Week 5: Retainers and Growth',
];

const PRODUCTION_WEEK_TITLES = [
    'Week 1: Pre-Production',
    'Week 2: Shooting Skills',
    'Week 3: Editing Mastery',
    'Week 4: Delivery Excellence',
    'Week 5: Scale and Optimize',
];

const UGC_WEEK_TIPS = [
    'Clarity beats complexity. Keep each deliverable simple and focused.',
    'Small daily reps build momentum faster than long weekly sprints.',
    'Show your process to brands, not just the final result.',
    'Make client communication proactive and predictable.',
    'Track your wins and double down on what converts.',
];

const NEGOTIATION_WEEK_TIPS = [
    'Confidence comes from knowing your numbers and your value.',
    'Define scope in writing before you talk price.',
    'Silence after your rate is a negotiation tool.',
    'Protect your time with clear revision limits.',
    'Retainers are built through consistency and results.',
];

const PRODUCTION_WEEK_TIPS = [
    'Plan the shoot before you turn on the camera.',
    'Lighting quality matters more than camera quality.',
    'Edit for clarity first, style second.',
    'Build a repeatable delivery checklist.',
    'Batch work to keep creative energy high.',
];

export const COURSE_SEED = [
    {
        id: 'ugc-creator-mastery',
        order: 1,
        title: 'UGC Creator Mastery',
        subtitle: 'Build your UGC business from scratch',
        shortDescription: 'A complete guide on how to start your UGC career and become super successful.',
        description:
            'Transform from complete beginner to professional UGC creator in 30 days with daily actionable tasks.',
        icon: 'videocam',
        ...COURSE_THEME_1,
        totalDays: 30,
        days: buildDays(UGC_DAY_TITLES, UGC_WEEK_TITLES, UGC_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'brand-deal-negotiation',
        order: 2,
        title: 'Brand Deal Negotiation',
        subtitle: 'Land better deals and protect your value',
        shortDescription: 'Master the art of negotiating brand deals and maximizing your earnings.',
        description:
            'Learn how to structure, negotiate, and close brand deals with confidence while protecting your time.',
        icon: 'trending-up',
        ...COURSE_THEME_2,
        totalDays: 30,
        days: buildDays(NEGOTIATION_DAY_TITLES, NEGOTIATION_WEEK_TITLES, NEGOTIATION_WEEK_TIPS),
        releaseAt: null,
    },
    {
        id: 'content-production-pro',
        order: 3,
        title: 'Content Production Pro',
        subtitle: 'Shoot, edit, and deliver like a pro',
        shortDescription: 'Professional production techniques for creating high-converting UGC.',
        description: 'Level up your production workflow with advanced shooting, editing, and delivery systems.',
        icon: 'camera',
        ...COURSE_THEME_3,
        totalDays: 30,
        days: buildDays(PRODUCTION_DAY_TITLES, PRODUCTION_WEEK_TITLES, PRODUCTION_WEEK_TIPS),
        releaseAt: buildNextMonthStart(),
    },
];
