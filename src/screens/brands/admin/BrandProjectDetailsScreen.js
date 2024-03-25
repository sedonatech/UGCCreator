import React, {
    useEffect,
    useLayoutEffect, useMemo, useState,
} from 'react';
import {
    ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {
    BLACK_30,
    WHITE, WHITE_40,
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    WRAPPER_MARGIN,
    SCREEN_WIDTH,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import HeaderIconButton from '../../../components/header/HeaderButton';
import ToggleCarousel from '../../../components/ToggleCarousel';
import BrandProjectDescriptionSection from './components/BrandProjectDescriptionSection';
import EnrolledCreators from './components/EnrolledCreators';

export const DETAILS_TAB = {
    name: 'Details',
    value: 'details',
};
export const ENROLLED_CREATORS = {
    name: 'Enrolled Creators',
    value: 'enrolledCreators',
};

const PROJECTS_COLLECTION = 'projects';
const TAB_DATA = [DETAILS_TAB, ENROLLED_CREATORS];

const BrandProjectDetailsScreen = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (projectId) getProject(projectId);
    }, [projectId]);

    const getProject = async (id) => {
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

    const [selectedTab, setSelectedTab] = useState(TAB_DATA[0]);

    const enrolledCreatorIds = useMemo(() => {
        if (!selectedProject) return null;
        return selectedProject?.applications?.map(({ creatorId }) => creatorId);
    }, [selectedProject]);

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
        });
    }, [navigation]);

    if (!selectedProject) return <LoadingOverlay message="Fetching project details..." backgroundColor={WHITE} />;

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
        >
            <TemplateBox
                fullGradient
                height={SCREEN_HEIGHT / 2.4}
                gradientColors={[BLACK_30, BLACK_30]}
            >
                {/* @ts-ignore */}
                <BackgroundImage
                    source={{ uri: selectedProject?.image }}
                    width={SCREEN_WIDTH}
                    style={styles.image}
                />
                <TemplateBox
                    absolute
                    top={(SCREEN_HEIGHT / 3.4)}
                    left={20}
                    pr={20}
                >
                    <TemplateText
                        bold
                        size={18}
                        color={WHITE}
                    >
                        {selectedProject?.title}
                    </TemplateText>
                    <TemplateBox height={10} />
                    <TemplateText
                        size={14}
                        color={WHITE}
                        numberOfLines={2}

                    >
                        {selectedProject?.shortDescription}
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>

            <TemplateBox selfCenter flex>
                <ToggleCarousel
                    data={TAB_DATA}
                    selectedTab={selectedTab}
                    onChange={setSelectedTab}
                />
            </TemplateBox>

            {selectedTab?.value === DETAILS_TAB?.value && selectedProject && (
                <BrandProjectDescriptionSection selectedProject={selectedProject} />
            )}
            {selectedTab?.value === ENROLLED_CREATORS?.value && enrolledCreatorIds && (
                <EnrolledCreators
                    creatorIds={enrolledCreatorIds}
                    projectId={projectId}
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
    image: {
        zIndex: -1,
    },
});
export default BrandProjectDetailsScreen;
