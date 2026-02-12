import { useState } from 'react';
import { Alert } from 'react-native';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useTranslation } from 'react-i18next';

import { options, optionsLandscapeMode, randomFileName } from '../../Utils/ImageUpload';
import { isIOS } from '../../Utils/Platform';

const useFirebaseSetStorage = () => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [picture, setPicture] = useState(false);

    const saveAPicture = async ({ isAvatar = false, customMetadata = {}, response, uuid }) =>
        new Promise((res, rej) => {
            setProgress(0);

            (async () => {
                try {
                    const path = response?.path;
                    const filename = response?.filename;
                    const isProgressPicture = filename || randomFileName();
                    const imageName = isAvatar || isProgressPicture;
                    const metadata = { customMetadata };

                    const reference = storage().ref(`users/${uuid}/${imageName}`);
                    const save = () => reference.putFile(path, metadata);

                    save().on('state_changed', taskSnapshot => {
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
                    return rej(err);
                }
            })();
        });

    const handlePermissionStatus = (status, name) => {
        switch (status) {
            case RESULTS.GRANTED:
                break;
            case RESULTS.BLOCKED:
                Alert.alert(
                    t('common.alerts.permissions.title', { name }),
                    t('common.alerts.permissions.blocked', { status, name }),
                    [{ text: t('common.buttons.ok') }],
                );
                break;
            case RESULTS.DENIED:
                Alert.alert(
                    t('common.alerts.permissions.title', { name }),
                    t('common.alerts.permissions.denied', { status, name }),
                    [{ text: t('common.buttons.ok') }],
                );
                break;

            case RESULTS.LIMITED:
                Alert.alert(
                    t('common.alerts.permissions.title', { name }),
                    t('common.alerts.permissions.limited', { status, name }),
                    [{ text: t('common.buttons.ok') }],
                );
                break;
            case RESULTS.UNAVAILABLE:
                Alert.alert(
                    t('common.alerts.permissions.title', { name }),
                    t('common.alerts.permissions.unavailable', { status, name }),
                    [{ text: t('common.buttons.ok') }],
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
        try {
            const pickerConfig = landscapeMode
                ? { ...optionsLandscapeMode, ...customOptions }
                : { ...options, ...customOptions, cropperCircleOverlay: !!isAvatar };

            const picked = await ImagePicker[pickerOptions](pickerConfig);
            console.log('[IMAGE-LIBRARY]: takeAPicture response:', picked);

            // Normalize (single selection expected; handle array just in case)
            const base = Array.isArray(picked) ? picked[0] : picked;

            // Derive fields needed downstream (do not change param names or imports)
            const mime = base?.mime || 'image/jpeg';
            const ext = mime === 'image/png' ? 'png' : 'jpg';
            const path = base?.path || base?.sourceURL || base?.localUri || base?.uri;
            if (!path) throw new Error('No local image path from picker');

            // IMPORTANT: don’t leak boolean isAvatar into filename
            const fileName = isAvatar ? `profile.${ext}` : `${(uuid && String(uuid)) || String(Date.now())}.${ext}`;

            const response = {
                ...base,
                mime,
                ext,
                path,
                fileName,
            };

            if (saveAutomatically) {
                await saveAPicture({
                    isAvatar,
                    customMetadata,
                    response,
                    uuid,
                });
            } else {
                setPicture({ ...response, ...customMetadata });
            }
        } catch (err) {
            console.log('[Image library] - take a picture error:', err?.code || String(err));

            if (err?.code === 'E_NO_LIBRARY_PERMISSION') {
                const permissionType = isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
                const result = await request(permissionType);
                handlePermissionStatus(result, 'Photo library');
            }

            if (err?.code === 'E_NO_CAMERA_PERMISSION') {
                const result = await request(isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
                handlePermissionStatus(result, 'Camera');
            }
        }
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
