import { useState } from 'react';
import { Alert } from 'react-native';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import {
    options,
    optionsLandscapeMode,
    randomFileName,
} from '../../Utils/ImageUpload';
import { isIOS } from '../../Utils/Platform';

const useFirebaseSetStorage = () => {
    const [progress, setProgress] = useState(0);
    const [picture, setPicture] = useState(false);

    const saveAPicture = async ({
        isAvatar = false,
        customMetadata = {},
        response,
        uuid,
    }) => new Promise(async (res, rej) => {
        setProgress(0);

        try {
            const path = response?.path;
            const filename = response?.filename;
            const isProgressPicture = filename || randomFileName();
            const imageName = isAvatar || isProgressPicture;
            const metadata = { customMetadata };

            const reference = storage().ref(`users/${uuid}/${imageName}`);
            const save = () => reference.putFile(path, metadata);

            save().on('state_changed', (taskSnapshot) => {
                console.log(
                    `[IMAGE-LIBRARY]: ${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                );
            });
            try {
                const result = await save();
                console.log('[IMAGE-LIBRARY]: Image uploaded to the bucket!');
                setProgress(1);
                setTimeout(() => setProgress(0), 1000);
                return res(result);
            } catch (error) {
                return rej(error);
            }
        } catch (err) {
            console.error(err);
        }
    });

    const handlePermissionStatus = (status, name) => {
        switch (status) {
            case RESULTS.GRANTED:
                break;
            case RESULTS.BLOCKED:
                Alert.alert(
                    `${name} permission`,
                    `You have ${status} ${name} permission`,
                    [{ text: 'OK' }],
                );
                break;
            case RESULTS.DENIED:
                Alert.alert(
                    `${name} permission`,
                    `You have ${status} ${name} permission`,
                    [{ text: 'OK' }],
                );
                break;

            case RESULTS.LIMITED:
                Alert.alert(
                    `${name} permission`,
                    `Your device  ${name} is has ${status} capabilities`,
                    [{ text: 'OK' }],
                );
                break;
            case RESULTS.UNAVAILABLE:
                Alert.alert(
                    `${name} permission`,
                    `Your device  ${name} is ${status}`,
                    [{ text: 'OK' }],
                );
                break;
            default:
                break;
        }
    };

    const takeAPicture = async ({
        saveAutomatically = false,
        isAvatar = false,
        landscapeMode = false,
        customMetadata = {},
        pickerOptions = 'openPicker',
        customOptions = {},
        uuid,
    }) => {
        await ImagePicker[pickerOptions](
            landscapeMode
                ? {
                    ...optionsLandscapeMode,
                    ...customOptions,
                }
                : {
                    ...options,
                    ...customOptions,
                    cropperCircleOverlay: !!isAvatar,
                },
        )
            .then((response) => {
                console.log('[IMAGE-LIBRARY]: takeAPicture response:', response);
                if (saveAutomatically) {
                    saveAPicture({
                        isAvatar, customMetadata, response, uuid,
                    });
                } else {
                    setPicture({ ...response, ...customMetadata });
                }
            })
            .catch((err) => {
                console.log('[Image library] - take a picture error:', err.code);
                if (err.code === 'E_NO_LIBRARY_PERMISSION') {
                    // Get the permission status
                    const permissionType = isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
                    request(permissionType)
                        .then((result) => {
                            handlePermissionStatus(result, 'Photo library');
                        });
                }
                if (err.code === 'E_NO_CAMERA_PERMISSION') {
                    // Get the permission status
                    request(isIOS
                        ? PERMISSIONS.IOS.CAMERA
                        : PERMISSIONS.ANDROID.CAMERA)
                        .then((result) => {
                            handlePermissionStatus(result, 'Camera');
                        });
                }
            });
    };

    const clearCurrentPicture = () => {
        setPicture(null);
    };

    return {
        takeAPicture,
        saveAPicture,
        progress,
        picture,
        clearCurrentPicture,
    };
};

export default useFirebaseSetStorage;
