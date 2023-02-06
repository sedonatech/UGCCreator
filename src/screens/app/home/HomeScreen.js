import React from 'react';
import {
    ScrollView, StyleSheet, View,
} from 'react-native';

import {
    BLACK_50,
    LAVENDER,
    LIGHT_PURPLE,
    WHITE,
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';

import Greeting from './components /Greeting';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Blob from '../../../../asssets/svgs/Blob';

import CurrentProjectsCarousel from './components /CurrentProjectsCarousel';
import BrandsCarousel from './components /BrandsCarousel';
import ProjectsCarousel from './components /ProjectsCarousel';

const HomeScreen = () => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </View>

            {profile?.userName && (
                <Greeting userName={profile?.userName} style={styles.greeting} />
            )}

            <CurrentProjectsCarousel style={styles.carousel} />
            <ProjectsCarousel style={styles.carousel} />
            <BrandsCarousel style={styles.carousel} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    greeting: {
        marginTop: SCREEN_HEIGHT * 0.14,
        marginBottom: WRAPPER_MARGIN,
        marginHorizontal: WRAPPER_MARGIN,
    },
    carousel: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default HomeScreen;
