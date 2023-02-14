import { Linking } from 'react-native';

export default (url) => {
    Linking.canOpenURL(url)
        .then(() => {
            Linking.openURL(url)
                .catch((e) => {
                    throw new Error(e);
                });
        })
        .catch((err) => {
            console.log('error opening', err);
            // eslint-disable-next-line no-alert
            alert(`Something went wrong: ${err.message}`);
        });
};
