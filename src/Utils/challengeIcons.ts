// utils/challengeIcons.ts
import { ChallengeMetrics } from '../hooks/useChallenge';

export type MetricKey = keyof ChallengeMetrics;

const METRIC_ICON_MAP: Record<MetricKey, string> = {
    views: 'Views',
    likes: 'Likes',
    comments: 'Comments',
    shares: 'Share',
    saves: 'Save',
    title: 'title',
};

export const getMetricIconName = (metricKey: MetricKey): string => {
    return METRIC_ICON_MAP[metricKey];
};
