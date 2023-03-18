import messaging from '@react-native-firebase/messaging';

import useAuthContext from '../auth/useAuthContext';
import useGetCreators from '../brands/useGetCreators';

const useFCMToken = () => {
    const { auth } = useAuthContext();

    const { creators } = useGetCreators();

    const { profile, updateProfile } = auth;

    const fcmToken = profile?.fcmToken;

    const createFCMToken = async () => {
        try {
            if (fcmToken) {
                return;
            }

            const newFCMToken = await messaging().getToken();
            if (newFCMToken) {
                await updateProfile({ fcmToken: newFCMToken }, profile?.id);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const getCreatorFCMToken = async (creatorId) => {
        if (!creators?.length) {
            return null;
        }
        const creator = creators?.find(({ id }) => id === creatorId);

        if (creator) {
            return creator.fcmToken;
        }
        return null;
    };

    const getAllCreatorFCMTokens = async () => {
        if (!creators?.length) {
            return null;
        }
        const creatorFCMTokens = creators?.map(({ fcmToken: token }) => token);
        return creatorFCMTokens;
    };

    return {
        createFCMToken,
        getCreatorFCMToken,
        getAllCreatorFCMTokens,
    };
};

export default useFCMToken;
