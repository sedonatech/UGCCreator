import React from 'react';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import { BLACK, IOS_BLUE } from '../../../../theme/Colors';
import useWebview from '../../../../hooks/webview/useWebview';
import { UPDATE_PORTFOLIO } from '../../../../navigation/ScreenNames';

const AboutSection = ({ about, shortDescription, portfolioLink }) => {
    const navigation = useNavigation();

    const { openLink } = useWebview();
    const handleOnPress = () => {
        if (portfolioLink) {
            openLink(portfolioLink);
        } else {
            navigation.navigate(UPDATE_PORTFOLIO);
        }
    };
    return (
        <TemplateBox mh={WRAPPER_MARGIN} mt={WRAPPER_MARGIN * 2} slideIn slideInDelay={200} slideInDirection="left">
            <TemplateText bold color={BLACK} size={16}>About Me</TemplateText>
            <TemplateText color={BLACK} size={14} lineHeight={16}>
                {'\n'}
                {shortDescription}
                {'\n'}
            </TemplateText>
            <TemplateText color={BLACK} size={14} lineHeight={16}>
                {about}
            </TemplateText>
            <TemplateBox height={10} />
            { portfolioLink && (
                <TemplateText color={BLACK} size={14} lineHeight={16} onPress={handleOnPress}>
                    Check out my portfolio at:
                    {' '}
                    <TemplateText color={IOS_BLUE} size={14} lineHeight={16} onPress={handleOnPress}>
                        {portfolioLink}
                    </TemplateText>
                </TemplateText>
            )}

        </TemplateBox>
    );
};

AboutSection.propTypes = {
    about: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
    portfolioLink: PropTypes.string,
};

AboutSection.defaultProps = {
    shortDescription: '',
    portfolioLink: '',
};
export default AboutSection;
