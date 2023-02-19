import { useActionSheet } from '@expo/react-native-action-sheet';
import { useEffect, useState } from 'react';
import useAuthContext from '../auth/useAuthContext';
import useFirebaseSetStorage from '../imageUpload/useFirebaseSetStorage';
import useFirebaseGetStorage from '../imageUpload/useFirebaseGetStorage';

const useImageStorage = () => {
    const { auth } = useAuthContext();
    const uuid = auth?.user?.uid;
    const { showActionSheetWithOptions } = useActionSheet();
    const [image, setImage] = useState();

    const { takeAPicture, progress } = useFirebaseSetStorage();
    const { getAvatar } = useFirebaseGetStorage();

    const handleOnPhotoSelect = async (options, isAvatar) => {
        await takeAPicture({
            saveAutomatically: true,
            isAvatar,
            customMetadata: {},
            pickerOptions: options,
            uuid,
        });
    };

    useEffect(() => {
        (async () => {
            try {
                const imageFromStorage = await getAvatar(uuid);
                if (imageFromStorage) {
                    setImage(imageFromStorage);
                }
            } catch (e) {
                console.log('-> e', e);
            }
        })();
    }, [progress]);

    const onAddImage = async (isAvatar = false) => {
        showActionSheetWithOptions(
            {
                options: ['Camera', 'Gallery', 'Cancel'],
                cancelButtonIndex: 2,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    handleOnPhotoSelect('openCamera', isAvatar);
                } else if (buttonIndex === 1) {
                    handleOnPhotoSelect('openPicker', isAvatar);
                }
            },
        );
    };

    return {
        image,
        onAddImage,
        progress,
    };
};

export default useImageStorage;
