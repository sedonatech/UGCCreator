import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
    LineChart,
} from 'react-native-chart-kit';

import TemplateText from '../../../components/TemplateText';
import {
    BLACK_SECONDARY, LAVENDER,
    WHITE,
} from '../../../theme/Colors';
import TemplateTouchable from '../../../components/TemplateTouchable';
import { ADD_PROJECT } from '../../../navigation/ScreenNames';
import CurrentProjectsCarousel from '../../app/home/components /CurrentProjectsCarousel';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Greeting from '../../app/home/components /Greeting';
import { HEADER_MARGIN, SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import Blob from '../../../../assets/svgs/Blob';
import TemplateBox from '../../../components/TemplateBox';
import CurrentCreatorsCarousel from './components/CurrentCreatorsCarousel';
import FeaturedCreatorsCarousel from './components/FeaturedCreatorsCarousel';
import { chartConfig, chartData } from '../../../consts/content/Home';
import { SHADOW } from '../../../theme/Shadow';
import BrandStatsGraph from './components/BrandStatsGraph';

const AdminPanelScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TemplateTouchable
                    style={styles.addButton}
                    onPress={() => navigation.navigate(ADD_PROJECT)}
                >
                    <TemplateText bold caps size={10} color={WHITE}>
                        Add project
                    </TemplateText>
                </TemplateTouchable>
            ),
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            {profile?.userName && (
                <Greeting userName={profile?.userName} style={styles.greeting} showAvatar={false} />
            )}
            <CurrentProjectsCarousel style={styles.carousel} isBrand />
            <CurrentCreatorsCarousel style={styles.carousel} />
            <FeaturedCreatorsCarousel style={styles.carousel} />
            <BrandStatsGraph />
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    addButton: {
        marginRight: 20,
        height: 30,
        borderRadius: 10,
        backgroundColor: BLACK_SECONDARY,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    greeting: {
        marginTop: HEADER_MARGIN,
        marginBottom: WRAPPER_MARGIN,
        marginHorizontal: WRAPPER_MARGIN,
    },
    carousel: {
        marginBottom: WRAPPER_MARGIN,
    },
});
export default AdminPanelScreen;
