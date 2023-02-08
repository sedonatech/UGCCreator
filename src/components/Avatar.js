import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';
import TemplateTouchable from './TemplateTouchable';
import AvatarIcon from '../../assets/svgs/AvatarIcon';
import { BLACK, BRAND_BLUE, LIGHT_PURPLE } from '../theme/Colors';
import useFirebaseSetStorage from '../hooks/imageUpload/useFirebaseSetStorage';
import useAuthContext from '../hooks/auth/useAuthContext';
import useFirebaseGetStorage from '../hooks/imageUpload/useFirebaseGetStorage';
import TemplateBox from './TemplateBox';
import TemplateIcon from './TemplateIcon';

const Avatar = ({ image, onPress, style }) => {
    const { auth } = useAuthContext();
    const uuid = auth?.user?.uid;
    const { showActionSheetWithOptions } = useActionSheet();
    const [avatar, setAvatar] = useState();

    const { takeAPicture, progress } = useFirebaseSetStorage();
    const { getAvatar } = useFirebaseGetStorage();

    const handleOnPhotoSelect = async (options) => {
        await takeAPicture({
            saveAutomatically: true,
            isAvatar: true,
            customMetadata: {},
            pickerOptions: options,
            uuid,
        });
    };

    useEffect(() => {
        (async () => {
            try {
                const avatarFromStorage = await getAvatar(uuid);
                if (avatarFromStorage) {
                    setAvatar(avatarFromStorage);
                }
            } catch (e) {
                console.log('-> e', e);
            }
        })();
    }, [progress]);
    const onAddPhoto = async () => {
        showActionSheetWithOptions(
            {
                options: ['Camera', 'Gallery', 'Cancel'],
                cancelButtonIndex: 2,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    handleOnPhotoSelect('openCamera');
                } else if (buttonIndex === 1) {
                    handleOnPhotoSelect('openPicker');
                } else {
                }
            },
        );
    };

    return (
        <TemplateTouchable style={[styles.container, style]}>
            {!avatar?.url ? (
                <TemplateBox
                    height={50}
                    width={50}
                    borderRadius={25}
                    backgroundColor={BRAND_BLUE}
                    justifyContent="center"
                    alignItems="center"
                    onPress={onAddPhoto}
                    hit
                >
                    <TemplateIcon
                        name="person-add-outline"
                        color={BLACK}
                        size={24}
                    />
                </TemplateBox>
            ) : (
                <TemplateTouchable onPress={onAddPhoto}>
                    <Image source={{ uri: avatar?.url }} style={styles.image} />
                </TemplateTouchable>
            )}
        </TemplateTouchable>
    );
};

Avatar.propTypes = {
    image: PropTypes.string,
    onPress: PropTypes.func,
    style: PropTypes.object,
};
Avatar.defaultProps = {
    image: null,
    onPress: () => {},
    style: {},
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
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});
export default Avatar;
