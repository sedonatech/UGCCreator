import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rate, { AndroidMarket } from 'react-native-rate';
import { useConfig } from '../context/core';

const reviewResponse = {
    positive: 'POSITIVE',
    negative: 'NEGATIVE',
};
const REVIEW_RESPONSE_KEY = 'reviewed';
const REVIEW_PROMPT_READY_KEY = 'review_prompt_ready';
const REVIEW_LAST_TRIGGER_KEY = 'review_last_trigger';

const normalizeStoredResponse = value => {
    if (value === reviewResponse.positive) {
        return reviewResponse.positive;
    }

    if (value === reviewResponse.negative) {
        return reviewResponse.negative;
    }

    return null;
};

export const getStoredReviewPromptState = async () => {
    try {
        const [value, promptReady] = await Promise.all([
            AsyncStorage.getItem(REVIEW_RESPONSE_KEY),
            AsyncStorage.getItem(REVIEW_PROMPT_READY_KEY),
        ]);

        return {
            previousResponse: normalizeStoredResponse(value),
            isPromptReady: promptReady != null ? JSON.parse(promptReady) : false,
        };
    } catch (error) {
        console.log(error);
        return {
            previousResponse: null,
            isPromptReady: false,
        };
    }
};

export const markReviewPromptEligibleForTrigger = async trigger => {
    try {
        if (!trigger) {
            return false;
        }

        const [value, lastTrigger] = await Promise.all([
            AsyncStorage.getItem(REVIEW_RESPONSE_KEY),
            AsyncStorage.getItem(REVIEW_LAST_TRIGGER_KEY),
        ]);

        if (value === reviewResponse.positive || lastTrigger === trigger) {
            return false;
        }

        await AsyncStorage.multiSet([
            [REVIEW_LAST_TRIGGER_KEY, trigger],
            [REVIEW_PROMPT_READY_KEY, JSON.stringify(true)],
        ]);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const useAppReview = () => {
    const { reviewPromptProps } = useConfig();

    const [previousResponse, setPreviousResponse] = useState();
    const [isPromptReady, setIsPromptReady] = useState(false);

    const setResponse = useCallback(async (value) => {
        try {
            await AsyncStorage.multiSet([
                [REVIEW_RESPONSE_KEY, value],
                [REVIEW_PROMPT_READY_KEY, JSON.stringify(false)],
            ]);
            setPreviousResponse(value);
            setIsPromptReady(false);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const setPromptReady = useCallback(async (value) => {
        try {
            await AsyncStorage.setItem(REVIEW_PROMPT_READY_KEY, JSON.stringify(value));
            setIsPromptReady(value);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const dismissReviewPrompt = useCallback(async () => {
        await setPromptReady(false);
    }, [setPromptReady]);

    const refreshReviewPromptState = useCallback(async () => {
        const state = await getStoredReviewPromptState();
        setPreviousResponse(state.previousResponse);
        setIsPromptReady(state.isPromptReady);
        return state;
    }, []);

    const markReviewPromptEligible = useCallback(
        async trigger => {
            const didArmPrompt = await markReviewPromptEligibleForTrigger(trigger);

            if (didArmPrompt) {
                setIsPromptReady(true);
            }

            return didArmPrompt;
        },
        [],
    );

    useEffect(() => {
        refreshReviewPromptState();
    }, [refreshReviewPromptState]);

    const handleRate = useCallback(() => {
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
                dismissReviewPrompt();
            }
        });
    }, [dismissReviewPrompt, reviewPromptProps, setResponse]);

    const shouldShowReviewPrompt = isPromptReady && previousResponse !== reviewResponse.positive;

    return {
        handleRate,
        previousResponse,
        shouldShowReviewPrompt,
        dismissReviewPrompt,
        markReviewPromptEligible,
        refreshReviewPromptState,
    };
};

export default useAppReview;
