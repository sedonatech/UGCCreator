import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TemplateText from '../../../components/TemplateText';
import {
    BRAND_BLUE, DEEP_PURPLE, GREEN, GREY, LAVENDER, PINK, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import Blob from '../../../../assets/svgs/Blob';
import TemplateBox from '../../../components/TemplateBox';
import {
    IS_ANDROID,
    SCREEN_HEIGHT, SCREEN_WIDTH, SPACE_LARGE, SPACE_MEDIUM, SPACE_SMALL, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateCarousel from '../../../components/carousels/TemplateCarousel';
import {
    CURRENT_PROJECTS, FEED_CATEGORIES,
    NO_CURRENT_PROJECT_MESSAGE,
    NO_CURRENT_PROJECT_TITLE,
    STATUS,
} from '../../../consts/content/Home';
import CurrentProjectCard from '../home/components /CurrentProjectCard';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import ToggleCarousel from '../../../components/ToggleCarousel';
import { CURRENT_PROJECT_DETAILS } from '../../../navigation/ScreenNames';

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
    const [selectedStatus, setSelectedStatus] = useState(STATUS[0]);

    const filteredProjects = useMemo(() => {
        if (!CURRENT_PROJECTS) return [];

        return CURRENT_PROJECTS.filter((item) => item?.currentStatus?.value === selectedStatus?.value);
    }, [CURRENT_PROJECTS, selectedStatus]);

    return (
        <ScrollView style={styles.container}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <TemplateBox
                mt={SCREEN_HEIGHT * 0.15}
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

            <ToggleCarousel
                data={STATUS}
                selectedTab={selectedStatus}
                onChange={setSelectedStatus}
            />

            {
                filteredProjects?.length ? filteredProjects.map((item, index) => (
                    <CurrentProjectCard
                        title={item?.title}
                        brand={item?.brand}
                        price={item?.price}
                        status={item?.currentStatus?.name}
                        notificationCount={item?.notifications}
                        documentCount={item?.documents}
                        daysLeft={item?.daysLeft}
                        progress={item?.currentStatus?.value === STATUS[1].value
                            ? item?.progress
                            : 0}
                        style={styles.card}
                        cardColor={WHITE}
                        tagColor={getTagColor(item?.currentStatus?.value)}
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
    tabs: {
        paddingHorizontal: WRAPPER_MARGIN,
        marginVertical: SPACE_LARGE,
    },
    card: {
        marginHorizontal: WRAPPER_MARGIN,
        marginBottom: SPACE_LARGE,
    },
});
export default OffersScreen;
