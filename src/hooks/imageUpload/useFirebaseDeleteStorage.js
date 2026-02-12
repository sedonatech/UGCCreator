import { Alert } from 'react-native';
import storage from '@react-native-firebase/storage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useFirebaseDeleteStorage = () => {
    const { t } = useTranslation();
    const [deleteProgress, setDeleteProgress] = useState(0);

    const handleFirebaseDelete = async item => {
        try {
            setDeleteProgress(0);
            const reference = storage().ref(item?.fullPath);
            await reference.delete();
            setDeleteProgress(1);
            setTimeout(() => setDeleteProgress(0), 1000);
            return true;
        } catch (error) {
            console.error('[IMAGE-LIBRARY] handleFirebaseDelete: ', error);
            return false;
        }
    };

    const deleteImage = async ({ item, skipAlert = false }) => {
        if (skipAlert) {
            await handleFirebaseDelete(item);
            return;
        }
        Alert.alert(
            t('common.alerts.removeImage.title'),
            t('common.alerts.removeImage.message'),
            [
                {
                    text: t('common.actions.cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: t('common.actions.yes'),
                    onPress: () => {
                        handleFirebaseDelete(item);
                    },
                },
            ],
            { cancelable: false },
        );
    };

    return {
        deleteImage,
        deleteProgress,
    };
};

export default useFirebaseDeleteStorage;
