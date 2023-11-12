import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
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
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import { BRAND_PROJECT_DETAILS } from '../../../navigation/ScreenNames';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import CurrentProjectCard from '../../app/home/components /CurrentProjectCard';

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
const BrandOffersScreen = ({ navigation }) => {
    const { projects } = useProjectsContext();

    const { auth } = useAuthContext();

    const brandName = auth?.profile;

    const enrolledProjects = useMemo(() => {
        if (!projects?.length) return [];
        return projects?.map((project) => ({
            id: project?.id,
            title: project?.title,
            brand: brandName,
            price: project?.price,
            status: project?.applications?.length ? 'Enrolled Creators' : 'No Enrolled Creators',
            notifications: project?.applications?.length || 0,
            documents: project?.applications?.[0]?.documents?.length || 0,
            daysLeft: differenceInDays(new Date(project?.endDate), new Date(project?.startDate)),
            onPress: () => navigation.navigate(BRAND_PROJECT_DETAILS, {
                projectId: project?.id,
            }),
        }));
    }, [projects]);

    return (
        <ScrollView style={styles.container}>
            <TemplateBox
                mt={HEADER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    startCase
                    bold
                    center
                >
                    Check the status of your projects
                </TemplateText>
            </TemplateBox>

            {
                enrolledProjects?.length ? enrolledProjects?.map((item, index) => (
                    item?.id && (
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
                                () => navigation.navigate(BRAND_PROJECT_DETAILS, {
                                    projectId: item?.id,
                                })
                            }
                            projectId={item?.id ? item?.id : ''}
                            isBrand
                        />
                    )
                )) : (
                    <ProfileStatusCard
                        title={NO_CURRENT_PROJECT_TITLE}
                        description={NO_CURRENT_PROJECT_MESSAGE}
                        showProgress={false}
                        style={styles.statusCard}
                        slideInDelay={200}
                        showIcon={false}
                    />
                )
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    card: {
        marginHorizontal: WRAPPER_MARGIN,
        marginVertical: SPACE_LARGE,
    },
    statusCard: {
        marginTop: WRAPPER_MARGIN,
        marginBottom: SPACE_LARGE,
    },
});
export default BrandOffersScreen;
