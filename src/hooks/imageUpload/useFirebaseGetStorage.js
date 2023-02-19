import storage from '@react-native-firebase/storage';

import { get, has, orderBy } from 'lodash';

const useFirebaseGetStorage = () => {
    const getAvatar = async (uuid) => {
        try {
            const reference = storage().ref(`users/${uuid}/true`);

            const url = await reference.getDownloadURL().catch(() => {
                console.log('[IMAGE-LIBRARY] User has not Avatar');
            });
            const metadata = await reference.getMetadata().catch(() => {
                console.log('[IMAGE-LIBRARY] User has not Avatar metadata');
            });
            const newData = { url, ...metadata };
            return newData;
        } catch (error) {
            console.error('[IMAGE-LIBRARY] getAvatar error', error);
            return false;
        }
    };

    const getImages = async (uuid) => {
        try {
            const reference = storage().ref(`users/${uuid}`);
            const referenceList = await reference.list();
            const items = get(referenceList, 'items', []);
            const data = items.map(async (ref) => {
                if (ref.fullPath === `users/${uuid}/avatar`) {
                    return null;
                }
                const newReference = storage().ref(ref.fullPath);
                const url = await newReference.getDownloadURL();
                const metadata = await newReference.getMetadata();
                return { url, ...metadata };
            });
            const awaitedData = await Promise.all(data);
            const filteredData = awaitedData.filter((data) => data);
            const newData = has(filteredData, '[0].customMetadata.date')
                ? orderBy(filteredData, ['customMetadata.date'], ['desc'])
                : orderBy(filteredData, ['updated'], ['desc']);
            console.log('[IMAGE-LIBRARY] getImages data', newData);
            return newData;
        } catch (error) {
            console.error('[IMAGE-LIBRARY] getImages:', error);
            return false;
        }
    };

    return {
        getAvatar,
        getImages,
    };
};

export default useFirebaseGetStorage;
