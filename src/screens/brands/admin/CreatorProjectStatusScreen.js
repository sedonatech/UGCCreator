import React, {
    useLayoutEffect, useMemo, useState,
} from 'react';
import {
    Animated, ScrollView, StyleSheet,
} from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { BLACK, GREEN, WHITE, WHITE_40 } from '../../../theme/Colors';
import HeaderIconButton from '../../../components/header/HeaderButton';
import { SCREEN_HEIGHT, WRAPPER_MARGIN, SCREEN_WIDTH } from '../../../theme/Layout';
import LoadingOverlay from '../../../components/LoadingOverlay';
import BackgroundImage from '../../../components/BackgroundImage';
import ToggleCarousel from '../../../components/ToggleCarousel';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import { HOME } from '../../../navigation/ScreenNames';
import CreatorProjectStatusOverviewTab from './components/CreatorProjectStatusOverviewTab';
import ProjectNotificationsTab from '../../app/offers/components/ProjectNotificationsTab';

const CURRENT_PROJECT_TABS = [
    {
        name: 'Overview',
        value: 'overview',
    },
    {
        name: 'Project Notifications',
        value: 'projectNotifications',
    },
];

const CreatorProjectStatusScreen = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;

    const creatorID = route?.params?.creatorID;

    const creatorEmail = route?.params?.creatorEmail;

    const creatorFCMToken = route?.params?.creatorFCMToken;

    const fromProjectDetails = route?.params?.fromProjectDetails;

    const [selectedTab, setSelectedTab] = useState(CURRENT_PROJECT_TABS[0]);

    const { projects } = useProjectsContext();

    const currentProject = useMemo(() => {
        if (!projects) return null;

        // @ts-ignore
        return projects?.find(({ id }) => id === projectId);
    }, [projectId, projects]);

    const application = useMemo(() => {
        if (!currentProject) return null;

        return currentProject?.applications?.length
            ? currentProject?.applications?.find(({ creatorId }) => creatorId === creatorID)
            : {};
    }, [currentProject, creatorID]);

    const pan = React.useRef(new Animated.ValueXY()).current;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => {
                        if (fromProjectDetails) {
                            navigation.navigate(HOME);
                            return;
                        }
                        navigation.goBack();
                    }}
                    backDropColor={WHITE_40}
                    ml={WRAPPER_MARGIN}
                />
            ),
        });
    }, [navigation]);

    if (!currentProject) return <LoadingOverlay message="Loading project details..." />;

    // TODO: Add the empty states of the document pickers

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: pan.y } } }],
                {
                    useNativeDriver: false,
                },
            )}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox
                height={SCREEN_HEIGHT / 2.4}
                style={{
                    transform: [
                        {
                            translateY: pan.y.interpolate({
                                inputRange: [-1000, 0],
                                outputRange: [-200, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            scale: pan.y.interpolate({
                                inputRange: [-3000, 0],
                                outputRange: [20, 1],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                {/* @ts-ignore */}
                <BackgroundImage
                    source={{ uri: currentProject?.image }}
                    width={SCREEN_WIDTH}
                    style={styles.image}
                />
                <TemplateBox
                    pl={WRAPPER_MARGIN}
                >
                    <TemplateBox
                        borderRadius={10}
                        ph={WRAPPER_MARGIN}
                        backgroundColor={GREEN}
                        alignItems="center"
                        justifyContent="center"
                        height={34}
                        mt={SCREEN_HEIGHT / 2.4 - 56}
                    >
                        <TemplateText bold size={10} color={WHITE}>
                            {
                                application?.status?.find(({ status }) => status === 'active')?.name
                            }
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>

            </TemplateBox>

            <TemplateBox
                mt={WRAPPER_MARGIN}
                ph={WRAPPER_MARGIN}
            >
                <TemplateText
                    bold
                    size={18}
                    color={BLACK}
                >
                    {currentProject?.title}
                </TemplateText>
                <TemplateBox height={10} />
                <TemplateText
                    size={14}
                    color={BLACK}
                    numberOfLines={2}
                >
                    {currentProject?.shortDescription}
                </TemplateText>
            </TemplateBox>
            <TemplateBox height={100}>
                <ToggleCarousel
                    data={CURRENT_PROJECT_TABS}
                    selectedTab={selectedTab}
                    onChange={setSelectedTab}
                    flex={false}
                />
            </TemplateBox>
            {
                selectedTab?.value === CURRENT_PROJECT_TABS[0].value && (
                    <CreatorProjectStatusOverviewTab
                        application={application}
                        creatorID={creatorID}
                        currentProject={currentProject}
                        creatorEmail={creatorEmail}
                        creatorFCMToken={creatorFCMToken}
                    />
                )
            }
            {
                selectedTab?.value === CURRENT_PROJECT_TABS[1].value && (
                    <ProjectNotificationsTab />
                )
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
    image: {
        zIndex: -1,
    },

});
export default CreatorProjectStatusScreen;
