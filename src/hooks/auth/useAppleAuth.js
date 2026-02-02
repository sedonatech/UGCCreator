import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import useProfile from '../user/useProfile';

const useAppleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { updateProfile, getProfile } = useProfile();

    const onAppleButtonPress = async () => {
        setLoading(true);
        setError(null);

        try {
            // Start the sign-in request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
                // See: https://github.com/invertase/react-native-apple-authentication#faqs
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });

            // Ensure Apple returned a user identityToken
            if (!appleAuthRequestResponse.identityToken) {
                throw new Error('Apple Sign-In failed - no identify token returned');
            }

            // Create a Firebase credential from the response
            const { identityToken, nonce } = appleAuthRequestResponse;
            const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

            // Sign the user in with the credential
            const userCredential = await auth().signInWithCredential(appleCredential);

            // Update last login time and FCM token
            const profile = await getProfile(userCredential.user.uid);

            if (profile) {
                const token = await messaging().getToken();
                const data = token
                    ? { lastLoginTime: new Date().toISOString(), token }
                    : { lastLoginTime: new Date().toISOString() };
                await updateProfile(data, profile?.id);
            }

            setLoading(false);
            return {
                user: userCredential.user,
                appleData: appleAuthRequestResponse,
                isNewUser: userCredential.additionalUserInfo?.isNewUser,
            };
        } catch (err) {
            setLoading(false);

            // Handle specific error cases
            if (err.code === '1001') {
                // User cancelled the sign-in flow
                setError('Apple Sign-In was cancelled');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Invalid Apple credential. Please try again.');
            } else {
                setError(err.message || 'Apple Sign-In failed. Please try again.');
            }

            throw err;
        }
    };

    return {
        onAppleButtonPress,
        loading,
        error,
    };
};

export default useAppleAuth;
