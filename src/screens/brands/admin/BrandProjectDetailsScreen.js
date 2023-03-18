import React, {
    useLayoutEffect, useMemo, useState,
} from 'react';
import {
    Animated,
    ScrollView, StyleSheet,
} from 'react-native';

import {
    BLACK_30,
    WHITE, WHITE_40,
} from '../../../theme/Colors';
import {
    SCREEN_HEIGHT,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateBox from '../../../components/TemplateBox';
import BackgroundImage from '../../../components/BackgroundImage';
import TemplateText from '../../../components/TemplateText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import HeaderIconButton from '../../../components/header/HeaderButton';
import useProjectsContext from '../../../hooks/brands/useProjectsContext';
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

const TAB_DATA = [DETAILS_TAB, ENROLLED_CREATORS];

const BrandProjectDetailsScreen = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;

    const { projects } = useProjectsContext();

    const [selectedTab, setSelectedTab] = useState(TAB_DATA[1]);

    const selectedProject = useMemo(() => {
        if (!projects) return null;

        return projects?.find(({ id }) => id === projectId);
    }, [projectId, projects]);

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

    const pan = React.useRef(new Animated.ValueXY()).current;

    if (!selectedProject) return <LoadingOverlay message="Fetching project details..." />;

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
        >
            <TemplateBox
                fullGradient
                height={SCREEN_HEIGHT / 2.4}
                gradientColors={[BLACK_30, BLACK_30]}
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
                    source={{ uri: selectedProject?.image }}
                    width="100%"
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
                        size={22}
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

            {selectedTab === DETAILS_TAB && selectedProject && (
                <BrandProjectDescriptionSection selectedProject={selectedProject} />
            )}
            {selectedTab === ENROLLED_CREATORS && enrolledCreatorIds && (
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
