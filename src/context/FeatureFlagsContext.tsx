import React, { createContext, useEffect, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import crashlytics from '@react-native-firebase/crashlytics';

/**
 * @name FeatureFlagContext
 * @description The provider used to fetch and store remote config from firebase
 * remote config for access to release features within the app.
 * @param children - React node
 * @param defaultFeatures - an object with the default features
 * @param refetch - the value used for the amount of time to pass before refetch is called.
 */

export const FeatureFlagContext = createContext(null);
const { Provider, Consumer: FeatureFlagConsumer } = FeatureFlagContext;

type Func = (value:any)=>any;

type ConfigType = {
    [key:string]: object | string | number | boolean | Func
};

type FeatureFlagProviderProps = {
    children:React.ReactNode,
    defaultFeatures: ConfigType,
    refetch:number
};

export const FeatureFlagProvider:React.FC<FeatureFlagProviderProps> = ({
    children,
    defaultFeatures,
    refetch = 200
}) => {
    const [config, setConfig] = useState<ConfigType>({});

    const fetchAll = async (debug = false) => {
        try {
            // @ts-ignore
            await remoteConfig().setDefaults(defaultFeatures);
            await remoteConfig().fetchAndActivate();

            // fetches and updates every 3.5 minutes as default.
            await remoteConfig().fetch(refetch);

            const allConfigs = await remoteConfig().getAll();

            if (allConfigs) {
                const parsedConfigs = Object.keys(allConfigs).reduce((a, key) => {
                    // @ts-ignore
                    // eslint-disable-next-line no-underscore-dangle
                    const value = allConfigs[key]?._value;
                    if (value) {
                        try {
                            // eslint-disable-next-line no-param-reassign
                            a[key] = typeof value === 'boolean' ? value : JSON.parse(value);
                        } catch (e) {
                            // @ts-ignore
                            crashlytics().recordError(e, 'firebase_config_parsing');
                            console.log('[FirebaseConfigProviders] parsedConfigs - Error: ', e);
                        }
                    }
                    return a;
                }, { ...defaultFeatures });

                if (debug) {
                    console.log('[Firebase Config Provider] - updated Config', parsedConfigs);
                }

                setConfig(parsedConfigs);
                return;
            }
            setConfig(defaultFeatures);
        } catch (e) {
            console.log('[Firebase Config Provider] - Error', e);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchAll(true);
        })();
    }, []);

    return (
        <Provider
            // @ts-ignore
            value={{
                ...config,
                fetchAll,
            }}
        >
            {children}
        </Provider>
    );
};

export default {
    FeatureFlagProvider,
    FeatureFlagContext,
    FeatureFlagConsumer
};
