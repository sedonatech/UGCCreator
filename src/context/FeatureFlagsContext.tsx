import React, { createContext, useEffect, useState } from 'react';
import { getRemoteConfig } from '@react-native-firebase/remote-config';
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
            // Only pass primitives to Remote Config defaults
            const primitiveDefaults: Record<string, string | number | boolean> = {};
            Object.keys(defaultFeatures).forEach((k) => {
                const v = (defaultFeatures as any)[k];
                if (['string', 'number', 'boolean'].includes(typeof v)) {
                    primitiveDefaults[k] = v as any;
                }
            });

            // Configure fetch interval instead of calling fetch(refetch)
            await getRemoteConfig().setConfigSettings({
                minimumFetchIntervalMillis: Math.max(0, refetch) * 1000,
            });

            // Set defaults & make sure RC is ready
            if (Object.keys(primitiveDefaults).length) {
                await getRemoteConfig().setDefaults(primitiveDefaults);
            }
            await getRemoteConfig().ensureInitialized();

            // Fetch and activate latest values
            await getRemoteConfig().fetchAndActivate();

            // Read everything via public API (no _value)
            const all = getRemoteConfig().getAll();

            const parsedConfigs = Object.keys(all).reduce((acc, key) => {
                try {
                    const str = all[key].asString(); // always a string
                    // Parse JSON-ish strings, else keep as string.
                    // This preserves falsy values like "false", "0", "".
                    let val: any = str;

                    // Try to interpret booleans/numbers first
                    if (str === 'true' || str === 'false') {
                        val = str === 'true';
                    } else if (/^-?\d+(\.\d+)?$/.test(str)) {
                        const num = Number(str);
                        // Preserve "0" correctly
                        if (!Number.isNaN(num)) val = num;
                    } else if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
                        val = JSON.parse(str);
                    }

                    (acc as any)[key] = val;
                } catch (e) {
                    // If parsing fails, fall back to raw string
                    (acc as any)[key] = all[key].asString();
                    crashlytics().recordError(e as any, 'firebase_config_parsing');
                    // eslint-disable-next-line no-console
                    console.log('[FirebaseConfigProviders] parsedConfigs - Error: ', e);
                }
                return acc;
            }, { ...defaultFeatures } as Record<string, any>);

            if (debug) {
                // eslint-disable-next-line no-console
                console.log('[Firebase Config Provider] - updated Config', parsedConfigs);
            }

            setConfig(parsedConfigs);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('[Firebase Config Provider] - Error', e);
            // On any failure, at least fall back to defaults so consumers have something
            setConfig({ ...defaultFeatures });
        }
    };

    useEffect(() => {
        (async () => {
            await fetchAll(true);
        })();
        // we intentionally run once; callers can invoke fetchAll as needed
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
