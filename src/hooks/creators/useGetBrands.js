import { useEffect, useState } from 'react';
import {
    getFirestore, collection, query, where, getDocs, onSnapshot,
} from '@react-native-firebase/firestore';
import calculateLastLoginTime from '../../Utils/calculateLastLoginTime';

const USERS_COLLECTION = 'users';

const useGetBrands = () => {
    const [brands, setBrands] = useState([]);
    const db = getFirestore();
    const brandsRef = query(collection(db, USERS_COLLECTION), where('type', '==', 'brand'));
    useEffect(() => {
        const unsubscribe = onSnapshot(brandsRef, (querySnapshot) => {
            const brandsData = querySnapshot?.docs
                ?.map((doc) => ({
                    id: doc?.id,
                    ...doc?.data(),
                    lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
                }));
            setBrands(brandsData);
        });
        return () => unsubscribe();
    }, []);

    const fetchBrands = async () => {
        try {
            const querySnapshot = await getDocs(brandsRef);
            const fetchedBrands = querySnapshot?.docs
                ?.map((doc) => doc?.data());
            setBrands(fetchedBrands);
        } catch (e) {
            console.log(e);
        }
    };

    return {
        brands,
        fetchBrands,
    };
};

export default useGetBrands;
