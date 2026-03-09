import React, { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import differenceInDays from 'date-fns/differenceInDays';
import TemplateText from '../../../components/TemplateText';
import { BRAND_BLUE, GREEN, LAVENDER, PINK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import { HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, SPACE_LARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import { NO_CURRENT_PROJECT_MESSAGE, NO_CURRENT_PROJECT_TITLE } from '../../../consts/content/Home';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { CURRENT_PROJECT_DETAILS, PROJECTS_SCREEN } from '../../../navigation/ScreenNames';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import HeaderIconButton from '../../../components/header/HeaderButton';
import CurrentProjectCard from '../../app/home/components /CurrentProjectCard';

const getTagColor = status => {
    if (status === 'backlog') {
        return BRAND_BLUE;
    }
    if (status === 'inProgress') {
        return PINK;
    }
    if (status === 'inReview') {
        return LAVENDER;
    }
    if (status === 'completed') {
        return GREEN;
    }
    return BRAND_BLUE;
};
const BrandOffersScreen = ({ navigation }) => {
    const { projects, projectLimits, setProjectLimits, getProjects } = useProjectsContext();
    const { auth } = useAuthContext();
    const { profile } = auth;

    useEffect(() => {
        getProjects(projectLimits);
    }, [projectLimits]);

    const brandName = profile?.userName || profile?.name;

    const brandProjects = useMemo(() => {
        if (!projects?.length) return [];

        return projects?.map(project => ({
            id: project?.id,
            title: project?.title,
            brand: brandName,
            image: project?.image,
            price: project?.price,
            status: project?.applications?.length ? 'Enrolled Creators' : 'No Enrolled Creators',
            notifications: project?.applications?.length || 0,
            documents: project?.applications?.[0]?.documents?.length || 0,
            daysLeft: differenceInDays(new Date(project?.endDate), new Date(project?.startDate)),
        }));
    }, [projects, brandName]);

    const renderItem = ({ item }, index) => (
        <CurrentProjectCard
            title={item?.title}
            brand={item?.brand}
            image={item?.image}
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
            projectId={item?.id}
            isBrand
            onPress={() => navigation.navigate(CURRENT_PROJECT_DETAILS, { projectId: item?.id })}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: WRAPPER_MARGIN }}
                ListHeaderComponent={
                    <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center" mb={20}>
                        <TemplateText size={18} startCase bold>
                            Check the status of your offers
                        </TemplateText>
                    </TemplateBox>
                }
                ListEmptyComponent={
                    <ProfileStatusCard
                        title={NO_CURRENT_PROJECT_TITLE}
                        description={NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                        showIcon={false}
                        onPress={() => navigation.navigate(PROJECTS_SCREEN)}
                    />
                }
                data={brandProjects}
                renderItem={renderItem}
                keyExtractor={item => item?.id}
                extraData={projectLimits}
                initialNumToRender={5}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    setProjectLimits(prevLimit => prevLimit + 10);
                }}
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
export default BrandOffersScreen;
