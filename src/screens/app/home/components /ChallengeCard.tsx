import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { WHITE } from '../../../../theme/Colors';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';

const ChallengeCard = () => {
    return (
        <TemplateBox
            mh={WRAPPER_MARGIN}
            ph={15}
            pv={20}
            borderRadius={20}
            mb={20}
            alignItems="center"
            backgroundColor={WHITE}
            shadow
        >
            <TemplateText bold size={18}>
                3 WEEK VIDEO CHALLENGE
            </TemplateText>
        </TemplateBox>
    );
};
export default ChallengeCard;
