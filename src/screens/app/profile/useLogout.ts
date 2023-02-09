import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

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
                            const response = await auth().signOut();
                            console.log('-> response', response);
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
    };
};

export default useLogout;
