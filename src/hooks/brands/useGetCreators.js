import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { isArray } from 'lodash';
import calculateLastLoginTime from '../../Utils/calculateLastLoginTime';

const USERS_COLLECTION = 'users';

const useGetCreators = (creatorId = '') => {
    const [creators, setCreators] = useState([]);

    const [fcmCreators, setFcmCreators] = useState([]);

    const [selectedCreator, setSelectedCreator] = useState({});

    const selectedCreatorRef = firestore().collection(USERS_COLLECTION)
        .doc(creatorId);

    const fcmCreatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator')
        .where('fcmToken', '!=', '');

    const creatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator');

    // useEffect(() => {
    //     const subscriber = creatorsRef
    //         .onSnapshot((querySnapshot) => {
    //             const creatorsData = querySnapshot?.docs
    //                 ?.map((doc) => ({
    //                     id: doc?.id,
    //                     ...doc?.data(),
    //                     lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
    //                 }));
    //             setCreators(creatorsData);
    //         });

    //     // Stop listening for updates when no longer required
    //     return () => subscriber();
    // }, []);

    // useEffect(() => {
    //     const subscriber = fcmCreatorsRef
    //         .onSnapshot((querySnapshot) => {
    //             const creatorsData = querySnapshot?.docs
    //                 ?.map((doc) => ({
    //                     id: doc?.id,
    //                     ...doc?.data(),
    //                     lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
    //                 }));
    //             setFcmCreators(creatorsData);
    //         });

    //     // Stop listening for updates when no longer required
    //     return () => subscriber();
    // }, []);

    // Fetch selected creator
    useEffect(() => {
        if (creatorId) {
            console.log({creatorId})
            const subscriber = selectedCreatorRef
                .onSnapshot((querySnapshot) => {

                    console.log({querySnapshot})
                    setSelectedCreator({
                        id: querySnapshot?.id,
                        ...querySnapshot?.data(),
                    });
                });
            // Stop listening for updates when no longer required
            return () => subscriber();
        }
        return () => {};
    }, [creatorId]);

    // Fetch  a list of creators without snapshot.get function

    const getAllCreators = async () => {
        // const querySnapshot = await creatorsRef.get();
        // const creatorsData = querySnapshot?.docs
        //     ?.map((doc) => ({
        //         id: doc?.id,
        //         ...doc?.data(),
        //     }));
        // setCreators(creatorsData);
    };

    const getCreators = async (ids) => {
        // let CreatorsListRef = firestore().collection(USERS_COLLECTION);
        // if (isArray(ids) && ids?.length) CreatorsListRef = CreatorsListRef.where('id', 'in', ids);
        // const querySnapshot = await CreatorsListRef.get();
        // const creatorsData = querySnapshot?.docs
        //     ?.map((doc) => ({
        //         id: doc?.id,
        //         ...doc?.data(),
        //     }));

        // return creatorsData;
    };

    return {
        creators,
        filteredCreators: creators?.filter((creator) => creator?.image !== '' && !!creator?.portfolioLink) || [],
        fcmCreators,
        selectedCreator,
        getAllCreators,
        getCreators,
    };
};

export default useGetCreators;
