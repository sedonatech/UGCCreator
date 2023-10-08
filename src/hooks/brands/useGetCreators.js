import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useGetCreators = () => {
    const [creators, setCreators] = useState([]);

    const creatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator');

    useEffect(() => {
        const subscriber = creatorsRef
            .onSnapshot((querySnapshot) => {
                const creatorsData = querySnapshot?.docs
                    ?.forEach((doc) => ({
                        id: doc?.id,
                        isActive: doc?.data()?.image !== '' && !!doc?.data()?.portfolioLink,
                        ...doc?.data(),
                    }));
                setCreators(creatorsData);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

    return {
        creators,
        filteredCreators: creators,
    };
};

export default useGetCreators;
