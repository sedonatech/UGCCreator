import React from 'react';
import PropTypes from 'prop-types';

import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import { BLACK, BLACK_60 } from '../../../../theme/Colors';

const AboutSection = ({ about, shortDescription }) => (
    <TemplateBox mh={WRAPPER_MARGIN} mt={WRAPPER_MARGIN * 2} slideIn slideInDelay={200} slideInDirection="left">
        <TemplateText bold color={BLACK} size={18}>About Me</TemplateText>
        <TemplateText color={BLACK_60} size={14} lineHeight={18}>
            {shortDescription}
            {'\n'}
        </TemplateText>
        <TemplateText color={BLACK_60} size={14} lineHeight={18}>
            {about}
        </TemplateText>
    </TemplateBox>
);

AboutSection.propTypes = {
    about: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
};

AboutSection.defaultProps = {
    shortDescription: '',
};
export default AboutSection;
