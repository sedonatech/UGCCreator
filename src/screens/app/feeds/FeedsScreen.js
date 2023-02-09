import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TemplateText from '../../../components/TemplateText';
import {
    IS_ANDROID, SCREEN_HEIGHT, SPACE_LARGE, SPACE_MEDIUM, SPACE_SMALL, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    DEEP_PURPLE, GREY, LAVENDER, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import Blob from '../../../../assets/svgs/Blob';
import TemplateCarousel from '../../../components/carousels/TemplateCarousel';
import { FEED_CATEGORIES } from '../../../consts/content/Home';

const FeedsScreen = () => {
    const [selectedStatus, setSelectedStatus] = useState(FEED_CATEGORIES[0].value);

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

            <TemplateCarousel
                data={FEED_CATEGORIES}
                renderItem={({ item }) => {
                    const isSelected = item.value === selectedStatus;
                    return (
                        <TemplateBox
                            mr={SPACE_MEDIUM}
                            alignItems="center"
                            onPress={() => setSelectedStatus(item.value)}
                        >
                            <TemplateText
                                size={16}
                                startCase
                                medium
                                color={isSelected ? DEEP_PURPLE : GREY}
                            >
                                {item.name}
                            </TemplateText>
                            {
                                isSelected && (
                                    <TemplateBox
                                        height={3}
                                        width={32}
                                        mt={SPACE_SMALL / 2}
                                        backgroundColor={DEEP_PURPLE}
                                        borderRadius={2}
                                    />
                                )
                            }
                        </TemplateBox>
                    );
                }}
                contentContainerStyle={styles.tabs}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    tabs: {
        paddingHorizontal: WRAPPER_MARGIN,
        marginVertical: SPACE_LARGE,
    },
});
export default FeedsScreen;
