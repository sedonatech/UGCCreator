import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useGetBrands = () => {
    const [brands, setBrands] = useState([]);

    const brandsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'brand');

    useEffect(() => {
        const subscriber = brandsRef
            .onSnapshot((querySnapshot) => {
                const brandsData = querySnapshot?.docs
                    ?.map((doc) => ({
                        id: doc?.id,
                        isActive: doc?.data()?.shortDescription && doc?.data()?.image,
                        ...doc?.data(),
                    }));
                setBrands(brandsData);
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
    };
};

export default useGetBrands;
