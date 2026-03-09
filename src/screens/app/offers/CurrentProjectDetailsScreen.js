import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TemplateText from '../../../components/TemplateText';
import { BLACK, GREEN, WHITE, WHITE_40 } from '../../../theme/Colors';
import HeaderIconButton from '../../../components/header/HeaderButton';
import { SCREEN_HEIGHT, WRAPPER_MARGIN, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH } from '../../../theme/Layout';
import LoadingOverlay from '../../../components/LoadingOverlay';
import BackgroundImage from '../../../components/BackgroundImage';
import OverviewTab from './components/OverviewTab';
import ProjectNotificationsTab from './components/ProjectNotificationsTab';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import useChatsContext from '../../../hooks/chats/useChatsContext';
import { HOME } from '../../../navigation/ScreenNames';
import useGetUser from '../../../hooks/creators/useGetUser';
import useTranslation from '../../../hooks/useTranslation';
import TemplateBox from '../../../components/TemplateBox';
import Button from '../../../components/Button';

const PROJECTS_COLLECTION = 'projects';

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

const CurrentProjectDetailsScreen = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;
    const fromProjectDetails = route?.params?.fromProjectDetails;

    const { auth } = useAuthContext();
    const { profile } = auth;
    const { t } = useTranslation();
    const { createChatRoom } = useChatsContext();
    const [selectedTab, setSelectedTab] = useState(CURRENT_PROJECT_TABS[0]);

    const { getProject } = useProjectsContext();
    const [currentProject, setCurrentProject] = useState(null);
    const [currentProjectBrand, setCurrentProjectBrand] = useState(null);

    const { getBrand } = useGetUser();

    useEffect(() => {
        const db = firestore();
        const unsubscribe = db
            .collection(PROJECTS_COLLECTION)
            .doc(projectId)
            .onSnapshot(
                doc => {
                    if (doc.exists) {
                        const result = { id: doc.id, ...doc.data() };
                        setCurrentProject(result);
                    }
                },
                error => {
                    console.log('[PROJECT LISTENER ERROR]', error);
                },
            );

        return () => {
            unsubscribe(); // clean up listener on unmount
        };
    }, [projectId]);

    useEffect(() => {
        async function fetchBrand() {
            if (currentProject?.brandId) {
                const data = await getBrand(currentProject?.brandId);
                if (data) setCurrentProjectBrand(data?.[0]);
            }
        }
        fetchBrand();
    }, [currentProject]);

    const application = useMemo(() => {
        if (!currentProject) return null;

        return currentProject?.applications?.length
            ? currentProject?.applications?.find(({ creatorId }) => creatorId === profile?.id)
            : {};
    }, [currentProject, profile?.id]);

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

    const creatorId = profile?.id;
    const creatorFCMToken = profile?.fcmToken;
    const creatorName = profile?.userName || profile?.name;
    const brandName = currentProjectBrand?.userName || currentProjectBrand?.name;
    const brandFCMToken = currentProjectBrand?.fcmToken;
    const chatRoomName = `BRAND:${brandName} - CREATOR:${creatorName} chat`;

    if (!currentProject) return <LoadingOverlay backgroundColor={WHITE} />;

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox height={SCREEN_HEIGHT / 2.4}>
                <BackgroundImage source={{ uri: currentProject?.image }} width={SCREEN_WIDTH} style={styles.image} />
                <TemplateBox>
                    <TemplateBox
                        borderRadius={10}
                        ph={WRAPPER_MARGIN}
                        backgroundColor={GREEN}
                        alignItems="center"
                        justifyContent="center"
                        height={40}
                        mt={SCREEN_HEIGHT / 2.4 - 66}
                        width={WRAPPED_SCREEN_WIDTH}
                        selfCenter
                    >
                        <TemplateText bold size={14} color={WHITE}>
                            {application?.status?.find(({ status }) => status === 'active')?.name}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox mt={WRAPPER_MARGIN} ph={WRAPPER_MARGIN}>
                <TemplateText bold size={18} color={BLACK}>
                    {currentProject?.title}
                </TemplateText>
                <TemplateBox height={10} />
                <TemplateText size={14} color={BLACK} numberOfLines={21}>
                    {currentProject?.shortDescription}
                </TemplateText>
            </TemplateBox>

            <TemplateBox selfCenter mv={WRAPPER_MARGIN}>
                <Button
                    title={t('offers.messageBrand')}
                    onPress={async () => {
                        try {
                            await createChatRoom(
                                chatRoomName,
                                creatorId,
                                currentProject?.brandId,
                                creatorFCMToken,
                                brandFCMToken,
                            );
                        } catch (e) {
                            console.log('-> e', e);
                        }
                    }}
                    height={50}
                    width={SCREEN_WIDTH - 40}
                    color={BLACK}
                />
            </TemplateBox>

            <TemplateBox height={20}>
                {/* <ToggleCarousel
                    data={CURRENT_PROJECT_TABS}
                    selectedTab={selectedTab}
                    onChange={setSelectedTab}
                    flex={false}
                /> */}
            </TemplateBox>
            {selectedTab?.value === CURRENT_PROJECT_TABS[0].value && (
                <OverviewTab
                    application={application}
                    currentProject={currentProject}
                    creatorID={profile?.id}
                    brandEmail={currentProjectBrand?.email}
                    brandFCMToken={currentProjectBrand?.fcmToken}
                />
            )}
            {selectedTab?.value === CURRENT_PROJECT_TABS[1].value && <ProjectNotificationsTab />}
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
export default CurrentProjectDetailsScreen;
