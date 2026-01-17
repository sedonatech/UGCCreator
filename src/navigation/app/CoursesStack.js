import { createStackNavigator } from '@react-navigation/stack';
import { SWITCH, TRANSPARENT_HEADER } from '../../components/header/ScreenOptions';
import { COURSE_DETAILS, COURSES, FEEDS } from '../ScreenNames';
import CoursesScreen from '../../screens/app/courses/CoursesScreen';
import CourseDetails from '../../screens/app/courses/CourseDetails';

const Stack = createStackNavigator();
const { Navigator, Screen } = Stack;

const CoursesStack = () => (
    <Navigator initialRouteName={FEEDS} screenOptions={SWITCH}>
        <Screen name={COURSES} options={TRANSPARENT_HEADER} component={CoursesScreen} />
        <Screen name={COURSE_DETAILS} options={TRANSPARENT_HEADER} component={CourseDetails} />
    </Navigator>
);

export default CoursesStack;
