import { useContext } from 'react';
import { FeatureFlagContext } from '../../context/FeatureFlagsContext';

export default (debug = false) => {
    const featureFlagContext = useContext(FeatureFlagContext);
    if (debug) {
        console.log('[useFeatureFlag] - context:', featureFlagContext);
    }

    return featureFlagContext;
};
