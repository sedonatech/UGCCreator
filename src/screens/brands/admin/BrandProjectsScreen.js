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
import { CURRENT_PROJECT_DETAILS } from '../../../navigation/ScreenNames';
import CurrentProjectCard from '../../app/home/components /CurrentProjectCard';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useAuthContext from '../../../hooks/auth/useAuthContext';

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
const BrandProjectsScreen = ({ navigation }) => {
    const { projects } = useProjectsContext();

    const { auth } = useAuthContext();

    const brandName = auth?.profile?.userName;

    const projectsData = useMemo(() => {
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
        }));
    }, [projects]);

    return (
        <ScrollView style={styles.container}>
            <TemplateBox
                mt={HEADER_MARGIN}
                mb={WRAPPER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    startCase
                    bold
                >
                    Check the status of your offers
                </TemplateText>
            </TemplateBox>

            {
                projectsData?.length ? projectsData.map((item, index) => (
                    <CurrentProjectCard
                        title={item?.title}
                        brand={item?.brand}
                        price={item?.price}
                        status={item?.status}
                        notificationCount={item?.notifications}
                        documentCount={item?.documents}
                        daysLeft={item?.daysLeft}
                        style={styles.card}
                        cardColor={WHITE}
                        tagColor={getTagColor(item?.value)}
                        width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                        slideInDelay={(index + 1) * 100}
                        key={item?.id}
                        onPress={
                            () => navigation.navigate(CURRENT_PROJECT_DETAILS,
                                { projectId: item?.id })
                        }
                    />
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
        marginBottom: SPACE_LARGE,
    },
});
export default BrandProjectsScreen;
