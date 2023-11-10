import { useState, useEffect } from 'react';
import moment from 'moment';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export default (title, viewRef) => {
    const appName = 'UGCCreatorApp';

    // This logic is due to a bug in react-native-share, where Share.open
    // returns too soon, so you can't rely on that for the unlink
    // Issue: https://github.com/react-native-community/react-native-share/issues/475
    const [tempFileUri, setTempFileUri] = useState(null);
    const [formattedFileUri, setFormattedFileUri] = useState(null);

    const clearImageCache = async () => {
        try {
            console.log('clearing: ');
            if (tempFileUri) {
                await RNFS.unlink(tempFileUri);
            }
            if (formattedFileUri) {
                await RNFS.unlink(formattedFileUri);
            }
        } catch (error) {
            // console.error(error)
            console.warn(error);
        }
    };

    useEffect(() => {
        clearImageCache();
    }, []);

    const shareScreenshot = async () => {
        setTimeout(async () => {
            await clearImageCache();
            try {
                let tempUri;
                if (viewRef) {
                    tempUri = await viewRef.current.capture();
                } else {
                    tempUri = await viewRef.current.capture({
                        format: 'jpg',
                        quality: 0.8,
                    });
                }
                setTempFileUri(tempUri);
                const uriArray = tempUri.split('/');
                const nameToChange = uriArray[uriArray.length - 1];
                const date = moment().format('D-M-YYYY-hh-mm-ss');
                const prefix = appName ? `${appName}-` : null;
                const baseName = `${title.capitalize()}-${date}.png`;
                const newName = (prefix ? `${prefix}${baseName}` : baseName).replace(/\s/g, '-');
                const uri = tempUri.replace(nameToChange, newName);
                const shareTitle = appName ? `Today's ${appName} workout'` : "Today's workout";
                setFormattedFileUri(uri);
                await RNFS.copyFile(tempUri, uri);

                return await Share.open({
                    title: shareTitle,
                    url: `file:// ${uri}`,
                    failOnCancel: false,
                }).then((val) => ({ ...val, path: formattedFileUri }));
            } catch (error) {
                console.warn('failed to share screenshot:', error);
            }
        }, 200);
    };

    return [shareScreenshot, formattedFileUri];
};
