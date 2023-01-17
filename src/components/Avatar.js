import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TemplateTouchable from './TemplateTouchable';
import {Image, StyleSheet} from 'react-native';

import {useActionSheet} from '@expo/react-native-action-sheet';
import AvatarIcon from '../../asssets/svgs/AvatarIcon';
import {LIGHT_PURPLE} from '../theme/Colors';
import useFirebaseSetStorage from '../hooks/imageUpload/useFirebaseSetStorage';
import useAuthContext from '../hooks/auth/useAuthContext';
import useFirebaseGetStorage from '../hooks/imageUpload/useFirebaseGetStorage';

const Avatar = ({image, onPress, style}) => {
  const {auth} = useAuthContext();
  const uuid = auth?.user?.uid;
  const {showActionSheetWithOptions} = useActionSheet();
  const [avatar, setAvatar] = useState();

  const {takeAPicture, progress} = useFirebaseSetStorage();
  const {getAvatar} = useFirebaseGetStorage();

  const handleOnPhotoSelect = async options => {
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
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            handleOnPhotoSelect('openCamera');
            break;
          case 1:
            handleOnPhotoSelect('openPicker');
            break;
          default:
            break;
        }
      },
    );
  };

  return (
    <TemplateTouchable style={[styles.container, style]} onPress={onAddPhoto}>
      {!avatar?.url ? (
        <AvatarIcon style={styles.image} size={30} />
      ) : (
        <Image source={{uri: avatar?.url}} style={styles.image} />
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
