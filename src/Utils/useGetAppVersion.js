import { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';

export default () => {
    const [nativeAppVersion, setNativeAppVersion] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setNativeAppVersion(await DeviceInfo.getVersion());
            } catch (e) {
                console.log('[useGetAppVersion] - error', e);
            }
        })();
    }, []);

    return { nativeAppVersion };
};
