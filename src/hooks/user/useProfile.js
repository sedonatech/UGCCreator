// eslint-disable-file consistent-return

import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import {
    DEFAULT_BRAND_DESCRIPTION,
    DEFAULT_CREATOR_DESCRIPTION,
    DEFAULT_CREATOR_SHORT_DESCRIPTION,
} from '../../consts/content/Portfolio';

export const USERS_COLLECTION = 'users';

const useProfile = () => {
    const [loading, setLoading] = useState(false);

    const [updateProfileLoading, setUpdateProfileLoading] = useState(false);

    const createCreatorProfile = async (userName, currentUser) => {
        try {
            await firestore()
                .collection(USERS_COLLECTION)
                .doc(currentUser?.uid)
                .set({
                    userName,
                    email: currentUser?.email,
                    id: currentUser?.uid,
                    image: currentUser?.photoURL || '',
                    shortDescription: DEFAULT_CREATOR_SHORT_DESCRIPTION,
                    description: DEFAULT_CREATOR_DESCRIPTION,
                    socialMedia: {
                        facebook: '',
                        instagram: '',
                        twitter: '',
                        youtube: '',
                        website: '',
                    },
                    sampleVideos: [],
                    samplePhotos: [],
                    portfolioLink: '',
                    rates: {
                        monthlyPackage: [
                            { title: 'Basic', price: 0, description: 'Only Short form photos or videos ' },
                            { title: 'Standard', price: 0, description: '20 Short form videos + 20 Short form photos' },
                            { title: 'Premium', price: 0, description: '20 Short form videos + 20 Short form photos and social media posts' },
                        ],
                        videoStartingRate: [
                            { title: 'Basic', price: 0, description: '1 short form video (15-20 sec)' },
                            { title: 'Standard', price: 0, description: '1 mid form video (30-60 sec)' },
                            { title: 'Premium', price: 0, description: '1 long form video (60-90 sec) and social media posts' },
                        ],
                        photoStartingRate: [
                            { title: 'Basic', price: 0, description: '3 photos' },
                            { title: 'Standard', price: 0, description: '6 photos' },
                            { title: 'Premium', price: 0, description: '10 photos' },
                        ],
                        revision: [
                            {
                                title: 'Video Revision',
                                price: 0,
                                description: 'Revisions are only for the video content',
                            },
                            {
                                title: 'Photo Revision',
                                price: 0,
                                description: 'Revisions are only for the photo content',
                            },
                        ],
                        usageRights: [
                            {
                                title: 'Video Usage Rights',
                                price: 0,
                                description: 'Usage rights for the video content',
                            },
                            {
                                title: 'Photo Usage Rights',
                                price: 0,
                                description: 'Usage rights for the photo content',
                            },
                        ],
                        exclusiveRights: [
                            {
                                title: 'Video Exclusive Rights',
                                price: 0,
                                description: 'Exclusive rights for the video content',
                            },
                            {
                                title: 'Photo Exclusive Rights',
                                price: 0,
                                description: 'Exclusive rights for the photo content',
                            },
                        ],
                    },
                    brands: [
                        {
                            name: '',
                            link: '',
                        },
                    ],
                    categories: [],
                    location: {
                        city: '',
                        country: '',
                    },
                    contact: {
                        phoneNumber: '',
                        email: '',
                    },
                    currentProjects: [],
                    paypalLink: '',
                    type: 'creator',
                    hasSubscription: false,
                    lastLoginTime: new Date().toISOString(),
                });
        } catch (e) {
            console.log(e);
        }
    };

    const createBrandProfile = async (userName, currentUser) => {
        try {
            await firestore().collection(USERS_COLLECTION).doc(currentUser?.uid).set({
                name: userName,
                email: currentUser?.email,
                id: currentUser?.uid,
                image: currentUser?.photoURL,
                shortDescription: '',
                description: DEFAULT_BRAND_DESCRIPTION,
                contact: {
                    email: '',
                    phone: '',
                    address: '',
                },
                categories: [],
                location: {
                    city: '',
                    country: '',
                },
                socialMedia: {
                    facebook: '',
                    instagram: '',
                    twitter: '',
                    youtube: '',
                    website: '',
                },
                type: 'brand',
                hasSubscription: false,
                lastLoginTime: new Date().toISOString(),
            });
        } catch (e) {
            console.log(e);
        }
    };

    const updateProfile = async (data, id) => {
        try {
            setUpdateProfileLoading(true);
            await firestore()
                .collection(USERS_COLLECTION)
                .doc(id)
                .update({
                    ...data,
                });
        } catch (e) {
            console.log("error updating profile:", e);
        }
        setUpdateProfileLoading(false);
    };

    const getProfile = async (id) => {
        try {
            const profile = await firestore()
                .collection(USERS_COLLECTION)
                .doc(id)
                .get();
            return profile.data();
        } catch (e) {
            console.log(e);
        }
    };

    return {
        createCreatorProfile,
        createBrandProfile,
        updateProfile,
        getProfile,
        loading,
        updateProfileLoading,
        setLoading,
    };
};

export default useProfile;
