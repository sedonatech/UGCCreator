// eslint-disable-file consistent-return
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, serverTimestamp } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useState } from 'react';
import {
    DEFAULT_BRAND_DESCRIPTION,
    DEFAULT_CREATOR_DESCRIPTION,
    DEFAULT_CREATOR_SHORT_DESCRIPTION,
} from '../../consts/content/Portfolio';

export const USERS_COLLECTION = 'users';

const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [mediaKitLoading, setMediaKitLoading] = useState(false);
    const [updateProfileLoading, setUpdateProfileLoading] = useState(false);

    const createCreatorProfile = async (userName, currentUser) => {
        try {
            const db = getFirestore();
            const userRef = doc(db, USERS_COLLECTION, currentUser?.uid);
            await setDoc(userRef, {
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
                        {
                            title: 'Premium',
                            price: 0,
                            description: '20 Short form videos + 20 Short form photos and social media posts',
                        },
                    ],
                    videoStartingRate: [
                        { title: 'Basic', price: 0, description: '1 short form video (15-20 sec)' },
                        { title: 'Standard', price: 0, description: '1 mid form video (30-60 sec)' },
                        {
                            title: 'Premium',
                            price: 0,
                            description: '1 long form video (60-90 sec) and social media posts',
                        },
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
            const db = getFirestore();
            const userRef = doc(db, USERS_COLLECTION, currentUser?.uid);
            await setDoc(userRef, {
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

            // Also add to the unified brands collection
            const brandsRef = doc(collection(db, 'brands'));
            await setDoc(brandsRef, {
                name: userName,
                email: currentUser?.email || '',
                link: '',
                category: '',
                description: DEFAULT_BRAND_DESCRIPTION,
                isActive: true,
                isBlocked: false,
                source: 'account',
                ownerId: currentUser?.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } catch (e) {
            console.log(e);
        }
    };

    const updateProfile = async (data, id) => {
        try {
            setUpdateProfileLoading(true);
            const db = getFirestore();
            const userRef = doc(db, USERS_COLLECTION, id);
            await updateDoc(userRef, {
                ...data,
            });
        } catch (e) {
            console.log('error updating profile:', e);
        }
        setUpdateProfileLoading(false);
    };

    const getProfile = async id => {
        try {
            const db = getFirestore();
            const userRef = doc(db, USERS_COLLECTION, id);
            const profileSnap = await getDoc(userRef);
            return profileSnap.data();
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    const saveMediaKitPdf = async ({ response, uuid }) =>
        new Promise((res, rej) => {
            (async () => {
                try {
                    const rawPath = response?.path;
                    const filename = response?.filename || 'media-kit.pdf';
                    if (!rawPath) return rej(new Error('No PDF path from picker'));

                    const path = decodeURI(rawPath); // only decode; do not strip file://

                    const metadata = { contentType: 'application/pdf' }; // valid settable metadata :contentReference[oaicite:2]{index=2}
                    const reference = storage().ref(`users/${uuid}/media-kit.pdf`);

                    const task = reference.putFile(path, metadata);

                    task.on(
                        'state_changed',
                        snap => {
                            console.log(`[MEDIA-KIT]: ${snap.bytesTransferred} / ${snap.totalBytes}`);
                        },
                        err => {
                            console.log('[MEDIA-KIT]: upload error object:', err);
                            console.log(
                                '[MEDIA-KIT]: native code/message:',
                                err?.nativeErrorCode,
                                err?.nativeErrorMessage,
                            );
                            rej(err);
                        },
                        () => res(task),
                    );
                } catch (err) {
                    rej(err);
                }
            })();
        });

    const updateMediaKit = async args => saveMediaKitPdf(args);

    const createProfile = async (userName, currentUser, type) => {
        if (type === 'creator') {
            return createCreatorProfile(userName, currentUser);
        }
        return createBrandProfile(userName, currentUser);
    };

    return {
        createCreatorProfile,
        createBrandProfile,
        createProfile,
        updateProfile,
        getProfile,
        loading,
        updateProfileLoading,
        setLoading,
        saveMediaKitPdf,
        updateMediaKit,
        mediaKitLoading,
    };
};

export default useProfile;
