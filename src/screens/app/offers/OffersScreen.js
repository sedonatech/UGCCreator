import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import {
    FlatList, StyleSheet, View,
} from 'react-native';
import differenceInDays from 'date-fns/differenceInDays';
import TemplateText from '../../../components/TemplateText';
import {
    BRAND_BLUE, GREEN, LAVENDER, PINK, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import {
    HEADER_MARGIN,
    IS_ANDROID, SCREEN_WIDTH, SPACE_LARGE, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    NO_CURRENT_PROJECT_MESSAGE,
    NO_CURRENT_PROJECT_TITLE,
} from '../../../consts/content/Home';
import CurrentProjectCard from '../home/components /CurrentProjectCard';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { CURRENT_PROJECT_DETAILS, PROJECTS_SCREEN } from '../../../navigation/ScreenNames';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import { projectStatuses } from '../../../consts/AppFilters/ProjectStatus';
import HeaderIconButton from '../../../components/header/HeaderButton';

const getTagColor = (status) => {
    if (status === 'backlog') {
        return BRAND_BLUE;
    } if (status === 'inProgress') {
        return PINK;
    } if (status === 'inReview') {
        return LAVENDER;
    } if (status === 'completed') {
        return GREEN;
    }
    return BRAND_BLUE;
};
const OffersScreen = ({ navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    title="Projects"
                    onPress={() => navigation.navigate(PROJECTS_SCREEN)}
                    backDropColor={BRAND_BLUE}
                    ml={WRAPPER_MARGIN}
                    mr={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

    const {
        projectLimits,
        setProjectLimits,
        getEnrolledProjects,
        enrolledProjects: projects,
    } = useProjectsContext();

    // const { brands } = useGetBrands();
    const { auth } = useAuthContext();
    const { profile } = auth;

    useEffect(() => {
        getEnrolledProjects(profile?.id, projectLimits);
    }, [projectLimits]);

    const enrolledProjects = useMemo(() => {
        if (!projects) return [];

        if (projects?.length) {
            return projects?.map((item) => {
                const application = item?.applications?.length
                    ? item?.applications?.find(({ creatorId }) => creatorId === profile?.id)
                    : {};
                const completedStatuses = application?.status?.filter(({ status }) => status === 'completed');

                const progress = completedStatuses?.length
                    ? Math.round((completedStatuses?.length / (projectStatuses?.length - 1)) * 10) / 10
                    : 0;
                return {
                    ...item,
                    ...application,
                    progress,
                    id: item?.id,
                    title: item?.title,
                    brand: item?.brandName,
                    price: `From ${item?.priceRange?.max} to ${item?.priceRange?.min} ${item?.currency}`,
                    status: application?.status?.filter(({ status }) => status === 'active')[0]?.name,
                    documentCount: application?.documents?.length,
                    daysLeft: differenceInDays(new Date(item?.endDate), new Date()),
                    currentStatus: application?.status?.filter(({ status }) => status === 'active')[0]?.name,
                };
            });
        }
        return [];
    }, [projects, profile]);

    const renderItem = ({ item }, index) => (
        <CurrentProjectCard
            title={item?.title}
            brand={item?.brand}
            price={item?.price}
            status={item?.status}
            notificationCount={item?.notifications}
            documentCount={item?.documents}
            daysLeft={item?.daysLeft}
            progress={item?.progress}
            style={styles.card}
            cardColor={getTagColor(item?.currentStatus?.value)}
            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
            slideInDelay={(index + 1) * 100}
            key={item?.id}
            onPress={
                () => navigation.navigate(CURRENT_PROJECT_DETAILS,
                    { projectId: item?.id })
            }
        />

    );

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: WRAPPER_MARGIN }}
                ListHeaderComponent={(
                    <TemplateBox
                        mt={HEADER_MARGIN}
                        alignItems="center"
                        justifyContent="center"
                        mb={20}
                    >
                        <TemplateText
                            size={18}
                            startCase
                            bold
                        >
                            Check the status of your offers
                        </TemplateText>
                    </TemplateBox>

                )}
                ListEmptyComponent={(
                    <ProfileStatusCard
                        title={NO_CURRENT_PROJECT_TITLE}
                        description={NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                        showIcon={false}
                        onPress={() => navigation.navigate(PROJECTS_SCREEN)}
                    />
                )}
                data={enrolledProjects}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
                extraData={projectLimits}
                initialNumToRender={5}
                onEndReachedThreshold={0.5}
                onEndReached={() => { setProjectLimits((prevLimit) => prevLimit + 10); }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    card: {
        marginVertical: 8,
        alignSelf: 'center',
    },
    statusCard: {
        marginTop: WRAPPER_MARGIN,
        marginBottom: SPACE_LARGE,
    },
});
export default OffersScreen;
