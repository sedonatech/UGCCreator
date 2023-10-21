import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useGetBrands = () => {
    const [brands, setBrands] = useState([]);

    const [fcmBrands, setFcmBrands] = useState([]);

    const brandsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'brand');

    const fcmBrandsRef = firestore().collection(USERS_COLLECTION)
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

    useEffect(() => {
        const subscriber = fcmBrandsRef
            .onSnapshot((querySnapshot) => {
                const brandsData = querySnapshot?.docs
                    ?.map((doc) => ({
                        id: doc?.id,
                        isActive: doc?.data()?.shortDescription && doc?.data()?.image,
                        ...doc?.data(),
                    }));
                setFcmBrands(brandsData);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

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

    return {
        brands,
        fetchBrands,
        fcmBrands,
    };
};

export default useGetBrands;
