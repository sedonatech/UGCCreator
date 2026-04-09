import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import TemplateBox from './TemplateBox';
import { WHITE } from '../theme/Colors';

const AvatarOverlaps = ({ imageUrls }) => (
    <TemplateBox row mv={10} alignItems="center">
        {!!imageUrls?.length &&
            imageUrls?.map((image, index) => (
                <FastImage
                    key={`${index}`}
                    source={{ uri: image }}
                    style={[
                        styles.avatar,
                        {
                            marginLeft: index === 0 ? 0 : -16,
                            zIndex: imageUrls.length - index,
                        },
                    ]}
                />
            ))}
    </TemplateBox>
);

AvatarOverlaps.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string),
};

AvatarOverlaps.defaultProps = {
    imageUrls: [],
};

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: WHITE,
    },
});

export default AvatarOverlaps;
