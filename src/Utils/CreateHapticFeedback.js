import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {isIOS} from './Platform';

export default () => {
  if (isIOS) {
    const options = {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    };

    ReactNativeHapticFeedback.trigger('impactLight', options);
  }
};
