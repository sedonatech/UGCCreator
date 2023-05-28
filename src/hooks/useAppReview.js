import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rate, { AndroidMarket } from 'react-native-rate';
import { useConfig } from '../context/core';

const useAppReview = () => {
    const { reviewPromptProps } = useConfig();

    const setResponse = async (value) => {
        try {
            await AsyncStorage.setItem('reviewed', value);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const reviewed = await AsyncStorage.getItem('reviewed');

                if (reviewed) {
                    return;
                }
                const options = {
                    AppleAppId: reviewPromptProps.AppleAppId,
                    GooglePackageName: reviewPromptProps.GooglePackageName,
                    preferInApp: true,
                    preferredAndroidMarket: AndroidMarket.Google,
                };
                Rate.rate(options, (success) => {
                    if (success) {
                        setResponse('true');
                    } else {
                        setResponse('false');
                    }
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
};

export default useAppReview;
