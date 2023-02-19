import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import {
    BLACK, BLACK_40, BRAND_BLUE, GREEN, LAVENDER, WHITE,
} from '../../../../theme/Colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../../theme/Layout';
import Blob from '../../../../../assets/svgs/Blob';
import Avatar from '../../../../components/Avatar';
import TemplateIcon from '../../../../components/TemplateIcon';

const PortfolioHeader = ({ userName, location }) => (
    <TemplateBox>
        <TemplateBox
            backgroundColor={BRAND_BLUE}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT * 0.24}
            borderBottomLeftRadius={20}
            borderBottomRightRadius={20}
        >

            <Blob top color={LAVENDER} />
            <Blob right color={LAVENDER} />
            <Blob color={LAVENDER} bottom />
            <Blob center />
            <TemplateBox
                absolute
                top={SCREEN_HEIGHT * 0.14}
                left={SCREEN_WIDTH * 0.5 - 102}
                borderWidth={2}
                borderColor={WHITE}
                borderRadius={40}
                width={204}
                height={184}
                justifyContent="center"
                alignItems="center"
            >
                <Avatar height={180} width={200} borderRadius={40} />
            </TemplateBox>
        </TemplateBox>
        <TemplateBox selfCenter slideIn slideInDelay={100} slideInDirection="left">
            <TemplateBox row mt={120} alignItems="center" mb={6}>
                <TemplateText bold size={24} color={BLACK}>{userName}</TemplateText>
                <TemplateIcon name="check-decagram" family="MaterialCommunity" color={GREEN} size={20} style={styles.icon} />
            </TemplateBox>
            <TemplateBox row alignItems="center">
                <TemplateText size={12} bold color={BLACK_40}>{`@${userName}`}</TemplateText>
                <TemplateBox width={10} />
                <TemplateBox row alignItems="center">
                    <TemplateIcon size={12} color={BLACK_40} name="location-outline" />
                    <TemplateText size={12} bold color={BLACK_40}>{location}</TemplateText>
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    </TemplateBox>
);

PortfolioHeader.propTypes = {
    userName: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    icon: {
        marginTop: 5.5,
    },
});
export default PortfolioHeader;
