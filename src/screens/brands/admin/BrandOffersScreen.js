import React, { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import differenceInDays from 'date-fns/differenceInDays';
import TemplateText from '../../../components/TemplateText';
import { BRAND_BLUE, GREEN, LAVENDER, PINK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import { HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, SPACE_LARGE, WRAPPER_MARGIN } from '../../../theme/Layout';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { BRAND_PROJECT_DETAILS, PROJECT_DETAILS, PROJECTS_SCREEN } from '../../../navigation/ScreenNames';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import CurrentProjectCard from '../../app/home/components /CurrentProjectCard';
import Loading from '../../../components/Loading';
import useTranslation from '../../../hooks/useTranslation';

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
    const { projects, projectLimits, setProjectLimits, getProjects, loading, getEnrolledProjects, enrolledProjects } =
        useProjectsContext();
    const { auth } = useAuthContext();
    const { profile } = auth;
    const { t } = useTranslation();

    const isBrand = profile?.type === 'brand';

    useEffect(() => {
        if (isBrand) {
            getProjects(projectLimits);
        } else {
            getEnrolledProjects(profile?.id, projectLimits);
        }
    }, [projectLimits, isBrand]);

    const brandName = profile?.userName || profile?.name;

    const sourceProjects = isBrand ? projects : enrolledProjects;

    const brandProjects = useMemo(() => {
        if (!sourceProjects?.length) return [];

        return sourceProjects?.reduce((acc, project) => {
            try {
                const endDate = project?.endDate?.toDate?.() ?? (project?.endDate ? new Date(project.endDate) : null);
                const startDate =
                    project?.startDate?.toDate?.() ?? (project?.startDate ? new Date(project.startDate) : null);
                const days = endDate && startDate ? differenceInDays(endDate, startDate) : undefined;

                acc.push({
                    id: project?.id,
                    title: project?.title,
                    description: project?.description,
                    brand: isBrand ? brandName : project?.brandName,
                    image: typeof project?.image === 'string' ? project.image : '',
                    price: project?.price,
                    status: isBrand
                        ? Array.isArray(project?.applications) && project.applications.length
                            ? t('offers.enrolledCreators')
                            : t('offers.noEnrolledCreators')
                        : project?.brandName,
                    notifications: Array.isArray(project?.applications) ? project.applications.length : 0,
                    documents: project?.applications?.[0]?.documents?.length || 0,
                    daysLeft: Number.isFinite(days) ? days : undefined,
                });
            } catch (e) {
                console.warn('Skipping project due to data error:', project?.id, e?.message);
            }
            return acc;
        }, []);
    }, [sourceProjects, brandName, isBrand, t]);

    const renderItem = ({ item }, index) => (
        <CurrentProjectCard
            title={item?.title}
            description={item?.description}
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
            isBrand={isBrand}
            onPress={() =>
                navigation.navigate(isBrand ? BRAND_PROJECT_DETAILS : PROJECT_DETAILS, { projectId: item?.id })
            }
        />
    );

    if (loading && !sourceProjects?.length) {
        return (
            <View style={styles.container}>
                <Loading />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: WRAPPER_MARGIN }}
                ListHeaderComponent={
                    <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center" mb={20}>
                        <TemplateText size={18} startCase bold>
                            {t('offers.headerTitle')}
                        </TemplateText>
                    </TemplateBox>
                }
                ListEmptyComponent={
                    <ProfileStatusCard
                        title={t('offers.emptyTitle')}
                        description={t('offers.emptyMessage')}
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
                    if (!loading && sourceProjects?.length) {
                        setProjectLimits(prevLimit => prevLimit + 10);
                    }
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
