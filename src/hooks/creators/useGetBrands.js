import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import calculateLastLoginTime from '../../Utils/calculateLastLoginTime';

const USERS_COLLECTION = 'users';

const useGetBrands = (brandId = '') => {
    const [brands, setBrands] = useState([]);

    const [selectedBrand, setSelectedBrand] = useState({});

    const [fcmBrands, setFcmBrands] = useState([]);

    const brandsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'brand');

    const fcmBrandsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'brand');

    const selectedBrandRef = firestore().collection(USERS_COLLECTION)
        .doc(brandId);

    // Fetch selected brand

    useEffect(() => {
        // const subscriber = selectedBrandRef
        //     .onSnapshot((querySnapshot) => {
        //         const brandData = querySnapshot?.data();
        //         setSelectedBrand(brandData);
        //     });

        // // Stop listening for updates when no longer required
        // return () => subscriber();
    }, []);

    useEffect(() => {
        const subscriber = brandsRef
            .onSnapshot((querySnapshot) => {
                const brandsData = querySnapshot?.docs
                    ?.map((doc) => ({
                        id: doc?.id,
                        ...doc?.data(),
                        lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
                    }));
                setBrands(brandsData);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

    useEffect(() => {
        // const subscriber = fcmBrandsRef
        //     .onSnapshot((querySnapshot) => {
        //         const brandsData = querySnapshot?.docs
        //             ?.map((doc) => ({
        //                 id: doc?.id,
        //                 ...doc?.data(),
        //                 lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
        //             }));
        //         setFcmBrands(brandsData);
        //     });

        // // Stop listening for updates when no longer required
        // return () => subscriber();
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
        selectedBrand,
    };
};

export default useGetBrands;
