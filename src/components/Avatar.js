import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';

import TemplateTouchable from './TemplateTouchable';
import { BLACK, BRAND_BLUE, LIGHT_PURPLE } from '../theme/Colors';
import TemplateBox from './TemplateBox';
import TemplateIcon from './TemplateIcon';
import useImageStorage from '../hooks/Portfolio/useImageStorage';
import useProfile from '../hooks/user/useProfile';
import useAuthContext from '../hooks/auth/useAuthContext';

const Avatar = ({
    style, height, width, borderRadius,
}) => {
    const { image: avatarData, onAddImage: onAddPhoto } = useImageStorage();

    const { auth } = useAuthContext();
    const { updateProfile } = useProfile();

    const { profile: profileData, update } = auth;

    const imageStyle = {
        width: '100%',
        height: '100%',
        borderRadius,
    };

    const avatar = useMemo(() => {
        if (avatarData) {
            return avatarData;
        }
        return null;
    }, [avatarData]);

    useEffect(() => {
        (async () => {
            try {
                if (avatar?.url) {
                    update('image', avatar?.url);
                    await updateProfile(profileData, profileData?.id);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [avatar]);

    return (
        <TemplateTouchable style={[styles.container, style]}>
            {!avatar?.url ? (
                <TemplateBox
                    height={height}
                    width={width}
                    borderRadius={borderRadius}
                    backgroundColor={BRAND_BLUE}
                    justifyContent="center"
                    alignItems="center"
                    onPress={() => onAddPhoto(true)}
                    hitslop={{ radius: 25 }}
                >
                    <TemplateIcon
                        name="person-add-outline"
                        color={BLACK}
                        size={24}
                    />
                </TemplateBox>
            ) : (
                <TemplateBox
                    height={height}
                    width={width}
                    borderRadius={borderRadius}
                    onPress={() => onAddPhoto(true)}
                    style={styles.imageBox}
                    hitslop={{ radius: 25 }}
                >
                    <Image
                        source={{ uri: profileData?.image }}
                        style={imageStyle}
                        resizeMode="cover"
                    />
                </TemplateBox>
            )}
        </TemplateTouchable>
    );
};

Avatar.propTypes = {
    style: PropTypes.shape({}),
    height: PropTypes.number,
    width: PropTypes.number,
    borderRadius: PropTypes.number,
};
Avatar.defaultProps = {
    style: {},
    height: 50,
    width: 50,
    borderRadius: 25,
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: LIGHT_PURPLE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Avatar;
