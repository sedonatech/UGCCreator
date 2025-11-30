import { ChallengeLeaderboardEntry } from '../../hooks/useChallengeSubmission';
import { BLACK, BLACK_10, BLUE_500, EMERALD_500, WHITE_30 } from '../../theme/Colors';
import { WRAPPED_SCREEN_WIDTH } from '../../theme/Layout';
import { getMetricIconName, MetricKey } from '../../Utils/challengeIcons';
import { getMetricColor } from '../../Utils/challengeMetricColors';
import openUrl from '../../Utils/openUrl';
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
                    height={40}
                    width={40}
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
                mb={20}
                onPress={() => {
                    openUrl(entry?.videoUrl || '');
                }}
            >
                <TemplateBox width="85%">
                    <TemplateText size={14} color={BLUE_500} mt={8} numberOfLines={2} adjustsFontSizeToFit>
                        {entry?.videoUrl}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox mt={18}>
                    <DynamicIcon name="Link" size={24} color={BLUE_500} />
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

export default LeaderBoardCard;
