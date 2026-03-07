import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { BLACK_30, WHITE, WHITE_40 } from '../../../theme/Colors';
import { SCREEN_HEIGHT, WRAPPER_MARGIN, SCREEN_WIDTH } from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ToggleCarousel from '../../../components/ToggleCarousel';
import BrandProjectDescriptionSection from './components/BrandProjectDescriptionSection';
import EnrolledCreators from './components/EnrolledCreators';
import useTranslation from '../../../hooks/useTranslation';

export const DETAILS_TAB = {
    value: 'details',
};
export const ENROLLED_CREATORS = {
    value: 'enrolledCreators',
};

const PROJECTS_COLLECTION = 'projects';

const getValidExternalUrl = url => {
    if (!url || typeof url !== 'string') return '';

    const sanitizedUrl = url
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, '')
        .trim();

    if (!sanitizedUrl) return '';

    const urlWithProtocol = /^https?:\/\//i.test(sanitizedUrl) ? sanitizedUrl : `https://${sanitizedUrl}`;

    if (!/^https?:\/\/[^\s]+$/i.test(urlWithProtocol)) return '';

    return encodeURI(urlWithProtocol);
};

const BrandProjectDetailsScreen = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;
    const { t } = useTranslation();
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (projectId) getProject(projectId);
    }, [projectId]);

    const getProject = async id => {
        try {
            const db = firestore();
            const doc = await db.collection(PROJECTS_COLLECTION).doc(id).get();
            if (doc.exists) {
                setSelectedProject({ id: doc?.id, ...doc?.data() });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const tabData = useMemo(
        () => [
            {
                ...DETAILS_TAB,
                name: t('brands.admin.projectDetails.tabs.details'),
            },
            {
                ...ENROLLED_CREATORS,
                name: t('brands.admin.projectDetails.tabs.enrolledCreators'),
            },
        ],
        [t],
    );
    const [selectedTab, setSelectedTab] = useState(tabData[0]);

    useEffect(() => {
        setSelectedTab(currentTab => tabData.find(({ value }) => value === currentTab?.value) || tabData[0]);
    }, [tabData]);

    const enrolledCreatorIds = useMemo(() => {
        if (!selectedProject) return null;
        return selectedProject?.applications?.map(({ creatorId }) => creatorId);
    }, [selectedProject]);

    const projectLink = useMemo(() => getValidExternalUrl(selectedProject?.link), [selectedProject?.link]);
    const shouldShowViewMore = !!projectLink;

    const handleOpenProjectLink = useCallback(async () => {
        if (!shouldShowViewMore) return;

        try {
            await Linking.openURL(projectLink);
        } catch (error) {
            console.log('open project link error:', error);
            Alert.alert(t('common.alerts.linkNotAvailable'));
        }
    }, [projectLink, shouldShowViewMore, t]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={WHITE_40}
                    ml={WRAPPER_MARGIN}
                />
            ),
            headerRight: () =>
                shouldShowViewMore ? (
                    <HeaderIconButton
                        name="open-outline"
                        title={t('common.actions.viewMore')}
                        onPress={handleOpenProjectLink}
                        backDropColor={WHITE_40}
                        mr={WRAPPER_MARGIN}
                    />
                ) : null,
        });
    }, [navigation, shouldShowViewMore, t, handleOpenProjectLink]);

    if (!selectedProject)
        return <LoadingOverlay message={t('brands.admin.loadingMessages.fetchingProject')} backgroundColor={WHITE} />;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} scrollEventThrottle={1}>
            <TemplateBox fullGradient height={SCREEN_HEIGHT / 2.4} gradientColors={[BLACK_30, BLACK_30]}>
                {/* @ts-ignore */}
                <BackgroundImage source={{ uri: selectedProject?.image }} width={SCREEN_WIDTH} style={styles.image} />
                <TemplateBox absolute top={SCREEN_HEIGHT / 3.4} left={20} pr={20}>
                    <TemplateText bold size={18} color={WHITE}>
                        {selectedProject?.title}
                    </TemplateText>
                    <TemplateBox height={10} />
                    <TemplateText size={14} color={WHITE} numberOfLines={2}>
                        {selectedProject?.shortDescription}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox selfCenter flex>
                <ToggleCarousel data={tabData} selectedTab={selectedTab} onChange={setSelectedTab} />
            </TemplateBox>

            {selectedTab?.value === DETAILS_TAB?.value && selectedProject && (
                <BrandProjectDescriptionSection selectedProject={selectedProject} />
            )}
            {selectedTab?.value === ENROLLED_CREATORS?.value && enrolledCreatorIds && (
                <EnrolledCreators creatorIds={enrolledCreatorIds} projectId={projectId} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    image: {
        zIndex: -1,
    },
});
export default BrandProjectDetailsScreen;
