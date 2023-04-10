import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import moment from 'moment/moment';
import { useIsFocused } from '@react-navigation/native';
import TemplateText from '../../../components/TemplateText';
import {
    BLACK_SECONDARY,
    WHITE,
} from '../../../theme/Colors';
import TemplateTouchable from '../../../components/TemplateTouchable';
import { ADD_PROJECT, BRAND_PROJECT_DETAILS } from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import Greeting from '../../app/home/components /Greeting';
import { HEADER_MARGIN, WRAPPER_MARGIN } from '../../../theme/Layout';
import CurrentCreatorsCarousel from './components/CurrentCreatorsCarousel';
import FeaturedCreatorsCarousel from './components/FeaturedCreatorsCarousel';
import ActiveProjectsCarousel from './components/ActiveProjectsCarousel';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import {
    BRAND_NO_CURRENT_PROJECT_MESSAGE,
    BRAND_NO_CURRENT_PROJECT_TITLE,
} from '../../../consts/content/Home';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import useRefresh from '../../../hooks/creators/useRefresh';

const AdminPanelScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const profile = auth?.profile;

    const isFocused = useIsFocused();

    const { projects } = useProjectsContext();

    const brandName = auth?.profile?.userName;

    const { refreshing, handleBrandRefresh } = useRefresh();

    const projectsCarouselData = useMemo(() => {
        if (!projects?.length) return [];
        return projects?.map((project) => ({
            id: project?.id,
            title: project?.title,
            brand: brandName,
            price: project?.price,
            status: project?.applications?.length ? 'Enrolled Creators' : 'No Enrolled Creators',
            notifications: project?.applications?.length || 0,
            documents: project?.applications?.[0]?.documents?.length || 0,
            daysLeft: moment.duration(moment(project?.endDate)
                .diff(moment(project?.startDate)))
                .asDays(),
            onPress: () => navigation.navigate(BRAND_PROJECT_DETAILS, {
                projectId: project?.id,
            }),
        }));
    }, [projects]);

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

    useEffect(() => {
        if (isFocused && profile) {
            auth?.getProfileCompleteStatus();
        }
    }, [
        isFocused,
        profile,
    ]);

    return (
        <ScrollView
            style={styles.container}
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleBrandRefresh}
                />
            )}
        >
            {profile?.name && (
                <Greeting userName={profile?.name} style={styles.greeting} showAvatar={false} />
            )}

            {
                projectsCarouselData?.length ? (
                    <ActiveProjectsCarousel
                        style={styles.carousel}
                        projectsCarouselData={projectsCarouselData}
                    />
                ) : (
                    <ProfileStatusCard
                        title={BRAND_NO_CURRENT_PROJECT_TITLE}
                        description={BRAND_NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                    />
                )
            }
            <CurrentCreatorsCarousel style={styles.carousel} />
            <FeaturedCreatorsCarousel style={styles.carousel} />
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
