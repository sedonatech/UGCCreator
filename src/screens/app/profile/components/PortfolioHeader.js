import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { BLACK, BLACK_60, BRAND_BLUE, WHITE } from '../../../../theme/Colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../../theme/Layout';
import Avatar from '../../../../components/Avatar';
import TemplateIcon from '../../../../components/TemplateIcon';
import useImageStorage from '../../../../hooks/Portfolio/useImageStorage';
import useTranslation from '../../../../hooks/useTranslation';

const PortfolioHeader = ({ userName, location, isUpdate, image, creatorId }) => {
    const { onAddImage } = useImageStorage();
    const { t } = useTranslation();
    return (
        <TemplateBox>
            <TemplateBox
                backgroundColor={BRAND_BLUE}
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT * 0.24}
                borderBottomLeftRadius={20}
                borderBottomRightRadius={20}
            >
                <TemplateBox
                    absolute
                    top={SCREEN_HEIGHT * 0.14}
                    left={SCREEN_WIDTH * 0.5 - 102}
                    borderWidth={10}
                    borderColor={WHITE}
                    borderRadius={42}
                    width={202}
                    height={182}
                    justifyContent="center"
                    alignItems="center"
                >
                    {creatorId ? (
                        <FastImage source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Avatar height={176} width={196} borderRadius={40} />
                    )}
                    {isUpdate && (
                        <TemplateBox
                            height={50}
                            width={50}
                            borderRadius={18}
                            borderWidth={4}
                            borderColor={WHITE}
                            absolute
                            mt={145}
                            ml={145}
                            backgroundColor={BRAND_BLUE}
                            justifyContent="center"
                            alignItems="center"
                            onPress={() => onAddImage(true)}
                        >
                            <TemplateIcon name="camera" color={BLACK} size={30} />
                        </TemplateBox>
                    )}
                </TemplateBox>
            </TemplateBox>
            {!isUpdate ? (
                <TemplateBox selfCenter slideIn slideInDelay={100} slideInDirection="left">
                    <TemplateBox row mt={120} alignItems="center" mb={6}>
                        <TemplateText bold size={20} color={BLACK} center>
                            {userName}
                        </TemplateText>
                    </TemplateBox>
                    {location && (
                        <TemplateBox row alignItems="center">
                            <TemplateText size={12} color={BLACK_60}>{`@${userName}`}</TemplateText>
                            <TemplateBox width={10} />
                            <TemplateBox row alignItems="center">
                                <TemplateText size={12} color={BLACK_60}>
                                    {location}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    )}
                </TemplateBox>
            ) : (
                <TemplateBox mt={135} alignItems="center" mb={6} selfCenter>
                    <TemplateText bold size={18} color={BLACK}>
                        {t('profile.portfolio.updateTitle')}
                    </TemplateText>
                </TemplateBox>
            )}
        </TemplateBox>
    );
};

PortfolioHeader.propTypes = {
    userName: PropTypes.string,
    location: PropTypes.string,
    isUpdate: PropTypes.bool,
    image: PropTypes.string,
    creatorId: PropTypes.string,
};

PortfolioHeader.defaultProps = {
    isUpdate: false,
    userName: '',
    location: '',
    image: '',
    creatorId: '',
};

const styles = StyleSheet.create({
    image: {
        height: 176,
        width: 196,
        borderRadius: 40,
    },
});
export default PortfolioHeader;
