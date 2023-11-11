import { Alert, Linking } from 'react-native';

export default (url, message = 'This link is not available') => {
    if (!url) {
        Alert.alert(message);
        return;
    }
    Linking.canOpenURL(url)
        .then(() => {
            Linking.openURL(url)
                .catch((e) => {
                    Alert.alert(message);
                    throw new Error(e);
                });
        })
        .catch((err) => {
            console.log('error opening', err);
            // eslint-disable-next-line no-alert
            Alert.alert(message);
        });
};
