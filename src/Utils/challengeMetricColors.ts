// utils/challengeMetricColor.ts
import { GRAY_500, BLUE_500, PINK_500, EMERALD_500, AMBER_500, CYAN_500, PURPLE_500 } from '../theme/Colors';
import { ChallengeMetrics } from '../hooks/useChallenge';

export type MetricKey = keyof ChallengeMetrics;

const METRIC_COLOR_MAP: Record<MetricKey, string> = {
    views: PURPLE_500,
    likes: PINK_500,
    comments: BLUE_500,
    shares: CYAN_500,
    saves: EMERALD_500,
    title: AMBER_500,
};

export const getMetricColor = (metricKey: MetricKey): string => {
    return METRIC_COLOR_MAP[metricKey] ?? GRAY_500;
};
