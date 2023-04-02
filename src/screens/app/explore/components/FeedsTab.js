import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import TemplateBox from '../../../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import VideoOverlay from '../../../../components/VideoOverlay';
import FeedCard from './FeedCard';

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

const FeedsTab = () => {
    const { feed } = useFeatureFlags();

    const [selectedVideoUrl, setSelectedVideoUrl] = useState();

    const filteredFeed = useMemo(() => {
        if (!feed?.feeds?.length) return [];

        return feed?.feeds;
    }, [feed]);

    return (
        <TemplateBox>
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
            <VideoOverlay
                url={selectedVideoUrl}
                onClose={() => setSelectedVideoUrl(null)}
            />
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
});
export default FeedsTab;
