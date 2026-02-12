import { Alert, Linking } from 'react-native';
import i18n from '../i18n';

export default (url, message = i18n.t('common.alerts.linkNotAvailable')) => {
    if (!url) {
        Alert.alert(message);
        return;
    }
    Linking.canOpenURL(url)
        .then(() => {
            Linking.openURL(url).catch(e => {
                Alert.alert(message);
                throw new Error(e);
            });
        })
        .catch(err => {
            console.log('error opening', err);

            Alert.alert(message);
        });
};
