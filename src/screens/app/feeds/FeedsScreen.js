import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    IS_ANDROID, SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    LAVENDER, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import Blob from '../../../../assets/svgs/Blob';
import { FEED_CATEGORIES } from '../../../consts/content/Home';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import ToggleCarousel from '../../../components/ToggleCarousel';
import FeedCard from '../explore/components/FeedCard';
import VideoOverlay from '../../../components/VideoOverlay';

const getIconByType = (type) => {
    if (type === 'ideas') {
        return 'trending-up-outline';
    } if (type === 'tips') {
        return 'rocket-outline';
    } if (type === 'videoLessons') {
        return 'videocam-outline';
    } if (type === 'hooks') {
        return 'reader-outline';
    } if (type === 'photoEditing') {
        return 'camera-outline';
    } if (type === 'ctaTips') {
        return 'bar-chart-outline';
    }
    return 'article';
};
const FeedsScreen = () => {
    const [selectedStatus, setSelectedStatus] = useState(FEED_CATEGORIES[0]);

    const { feed } = useFeatureFlags();

    const [selectedVideoUrl, setSelectedVideoUrl] = useState();

    const filteredFeed = useMemo(() => {
        if (!feed?.feeds?.length) return [];

        return feed?.feeds?.filter((item) => {
            if (selectedStatus?.value === 'all') return true;
            return item?.type === selectedStatus?.value;
        });
    }, [feed, selectedStatus]);

    return (
        <>
            <ScrollView style={styles.container}>
                <TemplateBox>
                    <Blob top color={LAVENDER} />
                    <Blob right color={LAVENDER} />
                    <Blob color={LAVENDER} bottom />
                    <Blob center />
                </TemplateBox>
                <TemplateBox
                    mt={HEADER_MARGIN}
                    alignItems="center"
                    justifyContent="center"
                >
                    <TemplateText
                        size={18}
                        startCase
                        bold
                    >
                        latest tips and trends
                    </TemplateText>
                </TemplateBox>

                <ToggleCarousel
                    data={FEED_CATEGORIES}
                    selectedTab={selectedStatus}
                    onChange={setSelectedStatus}
                />

                {
                    filteredFeed && filteredFeed?.map((item, index) => (
                        <FeedCard
                            key={`feed-${index}`}
                            image={{ uri: item?.thumbnail }}
                            title={item?.title}
                            icon={getIconByType(item?.type)}
                            subtitle={item?.subtitle}
                            shortDescription={item?.description}
                            style={styles.card}
                            showGradient
                            cardWidth={SCREEN_WIDTH / 1.12}
                            aspectRatio={1.8}
                            slideInDelay={(index + 1) * 100}
                            showVideoButton={item?.type === 'videoLessons'}
                            onPress={() => {
                                console.log('item', item?.videoUrl);
                                if (item?.type === 'videoLessons') {
                                    setSelectedVideoUrl(item?.videoUrl);
                                }
                            }}
                        />
                    ))
                }

            </ScrollView>
            <VideoOverlay
                url={selectedVideoUrl}
                onClose={() => setSelectedVideoUrl(null)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
});
export default FeedsScreen;
