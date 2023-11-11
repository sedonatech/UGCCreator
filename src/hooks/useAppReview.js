import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rate, { AndroidMarket } from 'react-native-rate';
import { useConfig } from '../context/core';

const reviewResponse = {
    positive: 'POSITIVE',
    negative: 'NEGATIVE',
};
const useAppReview = () => {
    const { reviewPromptProps } = useConfig();

    const [previousResponse, setPreviousResponse] = useState();

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
                const value = await AsyncStorage.getItem('reviewed');

                if (value === null) {
                    setPreviousResponse(null);
                }
                if (value === reviewResponse.positive) {
                    setPreviousResponse(reviewResponse.positive);
                }
                if (value === reviewResponse.negative) {
                    setPreviousResponse(reviewResponse.negative);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const handleRate = () => {
        const options = {
            AppleAppId: reviewPromptProps.AppleAppId,
            GooglePackageName: reviewPromptProps.GooglePackageName,
            preferInApp: true,
            preferredAndroidMarket: AndroidMarket.Google,
            openAppStoreIfInAppFails: false,
        };

        Rate.rate(options, (success) => {
            if (success) {
                setResponse(reviewResponse.positive);
            } else {
                setResponse(reviewResponse.negative);
            }
        });
    };

    return {
        handleRate,
        previousResponse,
    };
};

export default useAppReview;
