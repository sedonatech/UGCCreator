import { useNavigation } from '@react-navigation/native';
import { WEBVIEW } from '../../navigation/ScreenNames';

const useWebview = () => {
    const navigation = useNavigation();

    const openLink = (url) => {
        navigation.navigate(WEBVIEW, { url });
    };

    return {
        openLink,
    };
};

export default useWebview;
