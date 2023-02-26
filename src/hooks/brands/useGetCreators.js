import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';
const useGetCreators = () => {
    const [creators, setCreators] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
            .collection(USERS_COLLECTION)
            .onSnapshot((querySnapshot) => {
                setCreators(
                    querySnapshot?.docs
                        ?.map((doc) => doc?.data())
                        ?.filter(({ type }) => type === 'creator'),
                );
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

    return {
        creators,
        filteredCreators: creators?.filter(({ image }) => image !== ''),
    };
};

export default useGetCreators;
