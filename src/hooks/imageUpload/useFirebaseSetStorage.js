import { useState } from 'react';
import { Alert } from 'react-native';
import { get } from 'lodash';
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
            const path = get(response, 'path');
            const filename = get(response, 'filename');
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
                if (err.code === 'E_PERMISSION_MISSING') {
                    const error = new Error('User has not granted permissions');
                    error.code = 'PERMISSIONS';
                    throw error;
                }

                if (err.code === 'E_NO_CAMERA_PERMISSION') {
                    let permissionStatus;
                    request(isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((result) => {
                        permissionStatus = result
                    });

                    __DEV__ && console.log("something")

                    switch (permissionStatus) {
                        case RESULTS.GRANTED:
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert(
                                'Camera permission',
                                `You have ${permissionStatus} camera permission`,
                                [{ text: 'OK' }]
                            );
                            break;
                        case RESULTS.DENIED:
                            Alert.alert(
                                'Camera permission',
                                `You have ${permissionStatus} camera permission`,
                                [{ text: 'OK' }]
                            );
                            break;

                        case RESULTS.LIMITED:
                            Alert.alert(
                                'Camera permission',
                                `Your device camera is has ${permissionStatus} capabilities`,
                                [{ text: 'OK' }]
                            );
                            break;
                        case RESULTS.UNAVAILABLE:
                            Alert.alert(
                                'Camera permission',
                                `Your device camera is ${permissionStatus}`,
                                [{ text: 'OK' }]
                            );
                            break;
                        default:
                            break;
                    }
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
