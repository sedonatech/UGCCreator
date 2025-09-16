import {
    getStorage, ref, getDownloadURL, getMetadata, list,
} from '@react-native-firebase/storage';

const useFirebaseGetStorage = () => {
    const getAvatar = async (uuid) => {
        try {
            const storageInstance = getStorage();
            const reference = ref(storageInstance, `users/${uuid}/true`);

            let url = null;
            let metadata = null;
            try {
                url = await getDownloadURL(reference);
            } catch {
                console.log('[IMAGE-LIBRARY] User has not Avatar');
            }
            try {
                metadata = await getMetadata(reference);
            } catch {
                console.log('[IMAGE-LIBRARY] User has not Avatar metadata');
            }
            const newData = { url, ...metadata };
            return newData;
        } catch (error) {
            console.error('[IMAGE-LIBRARY] getAvatar error', error);
            return false;
        }
    };

    const getImages = async (uuid) => {
        try {
            const storageInstance = getStorage();
            const reference = ref(storageInstance, `users/${uuid}`);
            const referenceList = await list(reference);
            const items = referenceList?.items ?? [];
            const data = items.map(async (itemRef) => {
                if (itemRef.fullPath === `users/${uuid}/avatar`) {
                    return null;
                }
                const newReference = ref(storageInstance, itemRef.fullPath);
                const url = await getDownloadURL(newReference);
                const metadata = await getMetadata(newReference);
                return { url, ...metadata };
            });
            const awaitedData = await Promise.all(data);
            const filteredData = awaitedData.filter((data) => data);
            const newData = filteredData[0]?.customMetadata?.date
                ? filteredData?.sort((a, b) => b?.customMetadata?.date?.localeCompare(a?.customMetadata?.date)) // sort in descending order
                : filteredData?.sort((a, b) => b?.updated?.localeCompare(a?.updated)); // sort in descending order
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
