import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';
const useGetBrands = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
            .collection(USERS_COLLECTION)
            .onSnapshot((querySnapshot) => {
                setBrands(
                    querySnapshot?.docs
                        ?.map((doc) => doc?.data())
                        ?.filter(({ type }) => type === 'brand'),
                );
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

    const fetchBrands = async () => {
        const fetchedBrands = await firestore()
            .collection(USERS_COLLECTION)
            .get()
            .then((querySnapshot) => querySnapshot?.docs
                ?.map((doc) => doc?.data())
                ?.filter(({ type }) => type === 'brand'));
        setBrands(fetchedBrands);
    };

    return {
        brands,
        fetchBrands,
        filteredBrandsByBrandImage: brands?.filter(({ image }) => image !== ''),
    };
};

export default useGetBrands;
