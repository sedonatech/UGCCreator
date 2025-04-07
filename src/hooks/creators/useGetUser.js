import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useGetUser = () => {
    const [brands, setBrands] = useState([]);
    const brandsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'brand');

    const fetchBrands = async () => {
        try {
            const fetchedBrands = await brandsRef
                .get()
                .then((querySnapshot) => querySnapshot?.docs
                    ?.map((doc) => doc?.data()));
            setBrands(fetchedBrands);
        } catch (e) {
            console.log(e);
        }
    };

    const getBrand = async (id) => {
        try {
            const brand = await brandsRef
                .where('id', '==', id)
                .get()
                .then((querySnapshot) => querySnapshot?.docs
                    ?.map((doc) => doc?.data()));
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
