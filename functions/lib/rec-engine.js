/**
 * Map a gap to a recommendation object
 */
function buildRecommendationFromGap(gap) {
    const {
        metricKey, yourValue, cohortP75, deltaPct,
    } = gap;
    const recCatalog = {
        posts_per_week: {
            code: 'increase_cadence',
            title: 'Increase Posting Cadence',
            description: `Add ${Math.max(1, Math.ceil(cohortP75 - yourValue))} posts/week to reach the top quartile.`,
            rationale: `Your cadence ${yourValue.toFixed(1)}/wk vs P75 ${cohortP75.toFixed(1)} (−${(deltaPct * 100).toFixed(0)}%).`,
            projectedImpactScore: 8,
            effortScore: 3,
        },
        engagement_rate: {
            code: 'add_engagement_cta',
            title: 'Add Engagement CTAs',
            description: 'Include explicit save/comment CTAs in your next 5 posts.',
            rationale: `Engagement ${(yourValue * 100).toFixed(1)}% vs ${(cohortP75 * 100).toFixed(1)}%.`,
            projectedImpactScore: 7,
            effortScore: 2,
        },
        view_follower_ratio: {
            code: 'replicate_top_structure',
            title: 'Replicate Top Post Structure',
            description: 'Analyze your top 3 posts; repeat their pacing & visual cues.',
            rationale: `View/Follower ratio ${yourValue.toFixed(2)} vs ${cohortP75.toFixed(2)}.`,
            projectedImpactScore: 9,
            effortScore: 4,
        },
        hashtag_diversity: {
            code: 'rotate_hashtags',
            title: 'Rotate Hashtags',
            description: 'Add 3–5 new niche tags; retire low‑engagement ones.',
            rationale: `Diversity ${(yourValue * 100).toFixed(0)}% vs ${(cohortP75 * 100).toFixed(0)}%.`,
            projectedImpactScore: 5,
            effortScore: 1,
        },
        avg_caption_chars: {
            code: 'test_longer_captions',
            title: 'Test Longer Captions',
            description: 'Add context or a micro‑story to reach effective length.',
            rationale: `Avg chars ${yourValue.toFixed(0)} vs ${cohortP75.toFixed(0)}.`,
            projectedImpactScore: 4,
            effortScore: 1,
        },
        avg_hashtag_count: {
            code: 'optimize_hashtag_count',
            title: 'Optimize Hashtag Count',
            description: 'Match hashtag count with top quartile; remove noise tags.',
            rationale: `Avg count ${yourValue.toFixed(1)} vs ${cohortP75.toFixed(1)}.`,
            projectedImpactScore: 4,
            effortScore: 1,
        },
    };

    return recCatalog[metricKey] || null;
}

module.exports = { buildRecommendationFromGap };
