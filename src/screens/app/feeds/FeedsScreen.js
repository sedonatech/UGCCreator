import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateText from '../../../components/TemplateText';
import {
    IS_ANDROID, SCREEN_HEIGHT, SPACE_LARGE, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    LAVENDER, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import Blob from '../../../../assets/svgs/Blob';
import { FEED_CATEGORIES } from '../../../consts/content/Home';
import useFeatureFlags from '../../../hooks/auth/featureFlags/useFeatureFlags';
import ToggleCarousel from '../../../components/ToggleCarousel';

const FeedsScreen = () => {
    const [selectedStatus, setSelectedStatus] = useState(FEED_CATEGORIES[0]);

    const { feed } = useFeatureFlags();

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
                data={FEED_CATEGORIES}
                selectedTab={selectedStatus}
                onChange={setSelectedStatus}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
});
export default FeedsScreen;
