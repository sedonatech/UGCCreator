import Button from '../../../../components/Button';
import DynamicIcon from '../../../../components/icons/DynamicIcon';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { BLACK, BLACK_30, BLACK_SECONDARY, LIGHT_GREEN, WHITE } from '../../../../theme/Colors';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';

interface ChallengeCardProps {
    onPress?: () => void;
}
const ChallengeCard = ({ onPress }: ChallengeCardProps) => {
    return (
        <TemplateBox
            mh={WRAPPER_MARGIN}
            ph={15}
            pv={20}
            borderRadius={20}
            mb={20}
            alignItems="center"
            backgroundColor={WHITE}
            borderColor={BLACK_30}
            borderWidth={1}
        >
            <TemplateBox row justifyContent="space-between" mb={10} alignItems="center" width="100%">
                <TemplateBox
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={LIGHT_GREEN}
                    pv={8}
                    ph={15}
                    borderRadius={16}
                    row
                >
                    <DynamicIcon name="Trophy" size={16} />
                    <TemplateText size={14} medium color={BLACK_SECONDARY} ml={8}>
                        Win up to $500
                    </TemplateText>
                </TemplateBox>
                <TemplateText size={14}>Ends in 6 days</TemplateText>
            </TemplateBox>
            <TemplateText bold size={18} mv={10}>
                3 WEEK VIDEO CHALLENGE
            </TemplateText>
            <TemplateText size={14} center lineHeight={20} color={BLACK_SECONDARY}>
                A three week push where you{' '}
                <TemplateText size={14} semiBold>
                    post short videos, add our app download link
                </TemplateText>
                , and compete to land in the{' '}
                <TemplateText size={14} semiBold>
                    top 10 for cash rewards!
                </TemplateText>
            </TemplateText>

            <Button
                title="Enroll Now"
                height={46}
                width={290}
                color={BLACK}
                style={{ borderRadius: 20, marginTop: 24 }}
                onPress={onPress}
            />
        </TemplateBox>
    );
};

export default ChallengeCard;
