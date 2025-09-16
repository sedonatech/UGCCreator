import { useState } from 'react';
import {
    getFirestore, collection, query, where, getDocs,
} from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useGetUser = () => {
    const [brands, setBrands] = useState([]);
    const db = getFirestore();
    const brandsRef = query(collection(db, USERS_COLLECTION), where('type', '==', 'brand'));

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

    const getBrand = async (id) => {
        try {
            const brandQuery = query(collection(db, USERS_COLLECTION), where('type', '==', 'brand'), where('id', '==', id));
            const querySnapshot = await getDocs(brandQuery);
            const brand = querySnapshot?.docs
                ?.map((doc) => doc?.data());
            return brand;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    return {
        brands,
        fetchBrands,
        getBrand,
    };
};

export default useGetUser;
