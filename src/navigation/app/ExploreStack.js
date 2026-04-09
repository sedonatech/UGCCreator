import { createStackNavigator } from '@react-navigation/stack';

import ExploreScreen from '../../screens/app/explore/ExploreScreen';
import { BRAND_DETAILS, EXPLORE, FEED_DETAILS, PROJECT_DETAILS, WEBVIEW } from '../ScreenNames';
import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import BrandDetailsScreen from '../../screens/app/explore/BrandDetailsScreen';
import ProjectDetailsScreen from '../../screens/app/explore/ProjectDetailsScreen';
import FeedDetailsScreen from '../../screens/app/explore/FeedDetailsScreen';
import WebviewScreen from '../../screens/webview/WebviewScreen';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const ExploreStack = () => (
    <Navigator initialRouteName={EXPLORE} screenOptions={SWITCH}>
        <Screen name={EXPLORE} options={TRANSPARENT_HEADER} component={ExploreScreen} />
        <Screen name={BRAND_DETAILS} options={TRANSPARENT_HEADER} component={BrandDetailsScreen} />
        <Screen name={PROJECT_DETAILS} options={TRANSPARENT_HEADER} component={ProjectDetailsScreen} />
        <Screen name={FEED_DETAILS} options={TRANSPARENT_HEADER} component={FeedDetailsScreen} />
        <Screen name={WEBVIEW} options={TRANSPARENT_HEADER} component={WebviewScreen} />
    </Navigator>
);

export default ExploreStack;
