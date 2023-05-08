import analytics from '@react-native-firebase/analytics';

const useTrackEvent = () => {
    const trackEvent = async (event, options = {}) => {
        try {
            await analytics().logEvent(event, options);
        } catch (error) {
            console.log('[USE TRACK EVENT ERROR]: ', error);
        }
    };

    return { trackEvent };
};

export default useTrackEvent;
