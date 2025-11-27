import TemplateBox from '../../../../components/TemplateBox';
import { BLACK, BLACK_SECONDARY, WHITE } from '../../../../theme/Colors';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import React from 'react';
import { Image } from 'react-native';
//@ts-ignore
import challengeCardImage from '../../../../../assets/images/challenge-background.jpg';
import DynamicIcon from '../../../../components/icons/DynamicIcon';
import TemplateText from '../../../../components/TemplateText';
import Button from '../../../../components/Button';

interface ChallengeCardProps {
    onPress?: () => void;
}
const ChallengeCard = ({ onPress }: ChallengeCardProps) => {
    return (
        <TemplateBox
            mh={WRAPPER_MARGIN}
            ph={15}
            borderRadius={20}
            mb={20}
            alignItems="center"
            backgroundColor={WHITE}
            height={250}
            overflow="hidden"
        >
            <TemplateBox absolute top={0} left={0} right={0} overflow="hidden" height={250}>
                <Image source={challengeCardImage} style={{ width: '100%', height: '100%' }} />
            </TemplateBox>
            <TemplateBox alignItems="center" pAll={15}>
                <TemplateBox row justifyContent="space-between" mb={10} alignItems="center" width="100%">
                    <TemplateBox
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={WHITE}
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
                    width={290}
                    height={40}
                    color={BLACK}
                    style={{ borderRadius: 20, marginTop: 14 }}
                    onPress={onPress}
                />
            </TemplateBox>
        </TemplateBox>
    );
};

export default ChallengeCard;
