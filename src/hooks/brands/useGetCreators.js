import { useEffect, useState } from 'react';
import {
    getFirestore,
    doc,
    onSnapshot,
} from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useGetCreators = (creatorId = '') => {
    const [selectedCreator, setSelectedCreator] = useState({});
    const db = getFirestore();
    const selectedCreatorRef = doc(db, USERS_COLLECTION, creatorId);

    // Fetch selected creator
    useEffect(() => {
        if (creatorId) {
            const unsubscribe = onSnapshot(selectedCreatorRef, (querySnapshot) => {
                setSelectedCreator({
                    id: querySnapshot?.id,
                    ...querySnapshot?.data(),
                });
            });
            // Stop listening for updates when no longer required
            return () => unsubscribe();
        }
        return () => {};
    }, [creatorId]);

    return {
        selectedCreator,
    };
};

export default useGetCreators;
