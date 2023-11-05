import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const useGetCreators = (creatorId = '') => {
    const [creators, setCreators] = useState([]);

    const [fcmCreators, setFcmCreators] = useState([]);

    const selectedCreatorRef = firestore().collection(USERS_COLLECTION)
        .doc(creatorId);

    const [selectedCreator, setSelectedCreator] = useState({});

    const fcmCreatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator')
        .where('fcmToken', '!=', '');

    const creatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator');

    useEffect(() => {
        const subscriber = creatorsRef
            .onSnapshot((querySnapshot) => {
                const creatorsData = querySnapshot?.docs
                    ?.map((doc) => ({
                        id: doc?.id,
                        isActive: doc?.data()?.image !== '' && !!doc?.data()?.portfolioLink,
                        ...doc?.data(),
                    }));
                setCreators(creatorsData);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

    useEffect(() => {
        const subscriber = fcmCreatorsRef
            .onSnapshot((querySnapshot) => {
                const creatorsData = querySnapshot?.docs
                    ?.map((doc) => ({
                        id: doc?.id,
                        isActive: doc?.data()?.image !== '' && !!doc?.data()?.portfolioLink,
                        ...doc?.data(),
                    }));
                setFcmCreators(creatorsData);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);

    // Fetch selected creator
    useEffect(() => {
        const subscriber = selectedCreatorRef
            .onSnapshot((doc) => {
                setSelectedCreator({
                    id: doc?.id,
                    ...doc?.data(),
                });
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, [creatorId]);

    return {
        creators,
        filteredCreators: creators,
        fcmCreators,
        selectedCreator,
    };
};

export default useGetCreators;
