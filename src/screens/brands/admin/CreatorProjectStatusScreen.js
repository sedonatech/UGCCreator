import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { BLACK, GREEN, WHITE, WHITE_40 } from '../../../theme/Colors';
import HeaderIconButton from '../../../components/header/HeaderButton';
import { SCREEN_HEIGHT, WRAPPER_MARGIN, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH } from '../../../theme/Layout';
import LoadingOverlay from '../../../components/LoadingOverlay';
import BackgroundImage from '../../../components/BackgroundImage';
import ToggleCarousel from '../../../components/ToggleCarousel';
import { HOME } from '../../../navigation/ScreenNames';
import CreatorProjectStatusOverviewTab from './components/CreatorProjectStatusOverviewTab';
import ContactCreatorSection from './components/ContactCreatorSection';
import useTranslation from '../../../hooks/useTranslation';

const PROJECTS_COLLECTION = 'projects';

const CreatorProjectStatusScreen = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;
    const { t } = useTranslation();

    const creatorID = route?.params?.creatorID;

    const creatorEmail = route?.params?.creatorEmail;

    const creatorFCMToken = route?.params?.creatorFCMToken;

    const fromProjectDetails = route?.params?.fromProjectDetails;

    const tabData = useMemo(() => [
        { name: t('brands.admin.projectStatus.tabs.status') || 'Project Status', value: 'overview' },
        { name: t('brands.admin.projectStatus.tabs.contact') || 'Contact Creator', value: 'contactCreator' },
    ], [t]);

    const [selectedTab, setSelectedTab] = useState(tabData[0]);

    useEffect(() => {
        setSelectedTab(current => tabData.find(({ value }) => value === current?.value) || tabData[0]);
    }, [tabData]);

    const [currentProject, setCurrentProject] = useState(null);

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

    const application = useMemo(() => {
        if (!currentProject) return null;

        return currentProject?.applications?.length
            ? currentProject?.applications?.find(({ creatorId }) => creatorId === creatorID)
            : {};
    }, [currentProject, creatorID]);

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

    if (!currentProject) return <LoadingOverlay message={t('brands.admin.loadingMessages.loadingProject')} />;

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox height={SCREEN_HEIGHT / 2.4}>
                {/* @ts-ignore */}
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
                        <TemplateText bold size={10} color={WHITE}>
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
                <TemplateText size={14} color={BLACK} numberOfLines={2}>
                    {currentProject?.shortDescription}
                </TemplateText>
            </TemplateBox>
            <TemplateBox selfCenter flex>
                <ToggleCarousel
                    data={tabData}
                    selectedTab={selectedTab}
                    onChange={setSelectedTab}
                />
            </TemplateBox>
            {selectedTab?.value === 'overview' && (
                <CreatorProjectStatusOverviewTab
                    application={application}
                    creatorID={creatorID}
                    currentProject={currentProject}
                    creatorEmail={creatorEmail}
                    creatorFCMToken={creatorFCMToken}
                />
            )}
            {selectedTab?.value === 'contactCreator' && (
                <ContactCreatorSection
                    creatorID={creatorID}
                    creatorEmail={creatorEmail}
                    creatorFCMToken={creatorFCMToken}
                    projectTitle={currentProject?.title}
                />
            )}
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
