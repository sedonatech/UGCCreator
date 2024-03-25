import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import TemplateBox from '../../../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import FeedCard from './FeedCard';
import { BLACK } from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import { FEED_DETAILS } from '../../../../navigation/ScreenNames';
import getIconByType from '../../../../Utils/getIconByType';

const FeedsTab = () => {
    const { feed } = useFeatureFlags();

    const navigation = useNavigation();

    const filteredFeed = useMemo(() => {
        if (!feed?.feeds?.length) return [];

        return feed?.feeds?.filter((item, index) => index > 0);
    }, [feed]);

    return (
        <TemplateBox ph={WRAPPER_MARGIN + 4}>
            <TemplateBox mb={16}>
                <TemplateText size={18} bold>Feeds</TemplateText>
            </TemplateBox>
            <TemplateText size={13} color={BLACK} style={styles.subtitle}>
                Check out weekly content updates, these include:
                general tips, hooks examples, photo and video editing tips,
                video lessons and ideas.
            </TemplateText>
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
                        onPress={() => {
                            navigation.navigate(FEED_DETAILS, {
                                selectedFeed: item,
                            });
                        }}
                    />
                ))
            }
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
    subtitle: {

        marginBottom: 10,
    },
});
export default FeedsTab;
