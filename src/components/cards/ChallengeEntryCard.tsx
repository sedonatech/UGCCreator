import { ChallengeSubmission } from '../../hooks/useChallenge';
import { BLACK, BLACK_10, BLACK_80, FUCSHIA_500, WHITE_30 } from '../../theme/Colors';
import { WRAPPED_SCREEN_WIDTH } from '../../theme/Layout';
import { getMetricIconName, MetricKey } from '../../Utils/challengeIcons';
import { getMetricColor } from '../../Utils/challengeMetricColors';
import { formatTimeAgo } from '../../Utils/date';
import openUrl from '../../Utils/openUrl';
import DynamicIcon from '../icons/DynamicIcon';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';

interface ChallengeEntryCardProps {
    entry: ChallengeSubmission;
    onEdit?: () => void;
}

const ChallengeEntryCard: React.FC<ChallengeEntryCardProps> = ({ entry, onEdit }) => {
    return (
        <TemplateBox
            borderRadius={16}
            mb={16}
            pAll={12}
            backgroundColor={BLACK_10}
            width={WRAPPED_SCREEN_WIDTH}
            borderWidth={1}
            borderColor={BLACK_10}
            onPress={onEdit}
        >
            <TemplateBox row justifyContent="space-between" alignItems="center">
                <TemplateBox width="60%">
                    <TemplateText size={16} numberOfLines={1} adjustsFontSizeToFit medium>
                        {entry?.metrics?.title}
                    </TemplateText>
                    <TemplateBox flex />
                </TemplateBox>
                <TemplateBox backgroundColor={BLACK_10} borderRadius={10} ph={8} pv={4}>
                    <TemplateText size={12} numberOfLines={1} adjustsFontSizeToFit medium color={BLACK_80}>
                        {entry?.createdAt ? formatTimeAgo(entry.createdAt.toDate()) : ''}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox>
                    <DynamicIcon name="Edit" size={24} color={BLACK} />
                </TemplateBox>
            </TemplateBox>
            <TemplateBox
                row
                justifyContent="space-between"
                mt={10}
                mb={20}
                onPress={() => {
                    openUrl(entry?.videoUrl || '');
                }}
            >
                <TemplateBox width="85%">
                    <TemplateText size={14} color={FUCSHIA_500} mt={8} numberOfLines={2} adjustsFontSizeToFit>
                        {entry?.videoUrl}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox mt={18}>
                    <DynamicIcon name="Link" size={24} color={FUCSHIA_500} />
                </TemplateBox>
            </TemplateBox>

            <TemplateBox
                row
                justifyContent="space-between"
                mb={5}
                borderRadius={16}
                pAll={12}
                borderWidth={1}
                borderColor={BLACK_10}
                backgroundColor={WHITE_30}
            >
                {(['views', 'likes', 'comments', 'shares'] as MetricKey[]).map(key => (
                    <TemplateBox key={key} row alignItems="center">
                        <DynamicIcon name={getMetricIconName(key) as any} size={14} color={getMetricColor(key)} />
                        <TemplateText ml={6} size={14} medium color={BLACK}>
                            {entry.metrics[key]}
                        </TemplateText>
                    </TemplateBox>
                ))}
            </TemplateBox>
        </TemplateBox>
    );
};

export default ChallengeEntryCard;
