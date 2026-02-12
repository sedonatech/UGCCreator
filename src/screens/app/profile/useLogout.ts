import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLogout = () => {
    const { t } = useTranslation();
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
                            await auth().signOut();
                            RNRestart.Restart();
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
            t('settings.rows.deleteAccount.alertTitle'),
            t('settings.rows.deleteAccount.alertMessage'),
            [
                {
                    text: t('settings.rows.deleteAccount.cancelButton'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: t('settings.rows.deleteAccount.confirmButton'),
                    onPress: async () => {
                        try {
                            await auth().currentUser?.delete();
                            const allKeys = await AsyncStorage.getAllKeys();
                            if (allKeys?.length > 0) {
                                await AsyncStorage.multiRemove(allKeys);
                            }
                            await auth().signOut();
                            RNRestart.Restart();
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
