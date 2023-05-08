import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const useLogout = () => {
    const logout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const allKeys = await AsyncStorage.getAllKeys();
                            if (allKeys?.length > 0) {
                                await AsyncStorage.multiRemove(allKeys);
                            }
                            await auth().signOut();
                        } catch (e) {
                            console.error(e);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const deleteAccount = () => {
        Alert.alert(
            'Delete Account Permanently',
            'Are you sure you want to delete your account?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const allKeys = await AsyncStorage.getAllKeys();
                            if (allKeys?.length > 0) {
                                await AsyncStorage.multiRemove(allKeys);
                            }
                            await auth().currentUser?.delete();
                        } catch (e) {
                            console.error(e);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    return {
        logout,
        deleteAccount,
    };
};

export default useLogout;
