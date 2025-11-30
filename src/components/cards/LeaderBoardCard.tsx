import { ChallengeLeaderboardEntry } from '../../hooks/useChallengeSubmission';
import { BLACK, BLACK_10, EMERALD_500, WHITE_30 } from '../../theme/Colors';
import { WRAPPED_SCREEN_WIDTH } from '../../theme/Layout';
import { getMetricIconName, MetricKey } from '../../Utils/challengeIcons';
import { getMetricColor } from '../../Utils/challengeMetricColors';
import DynamicIcon from '../icons/DynamicIcon';
import TemplateBox from '../TemplateBox';
import TemplateText from '../TemplateText';

interface LeaderBoardCardProps {
    entry: ChallengeLeaderboardEntry;
}

const LeaderBoardCard: React.FC<LeaderBoardCardProps> = ({ entry }) => {
    return (
        <TemplateBox
            borderRadius={16}
            mb={16}
            pAll={12}
            backgroundColor={BLACK_10}
            width={WRAPPED_SCREEN_WIDTH}
            borderWidth={1}
            borderColor={BLACK_10}
        >
            <TemplateBox row justifyContent="space-between" alignItems="center">
                <TemplateBox
                    height={50}
                    width={50}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={30}
                    borderColor={EMERALD_500}
                    borderWidth={1}
                >
                    <TemplateText size={18} bold color={EMERALD_500}>
                        {entry?.position}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox width="50%">
                    <TemplateText size={16} numberOfLines={1} adjustsFontSizeToFit medium ml={10}>
                        {entry?.userName}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox flex />
                <TemplateBox>
                    <TemplateText size={14} numberOfLines={1} adjustsFontSizeToFit medium>
                        {entry?.points} pts
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox
                row
                justifyContent="space-between"
                mb={5}
                mt={16}
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

export default LeaderBoardCard;
