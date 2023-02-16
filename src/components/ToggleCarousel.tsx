import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import TemplateBox from './TemplateBox';
import {
    SPACE_LARGE, SPACE_MEDIUM, SPACE_SMALL, WRAPPER_MARGIN
} from '../theme/Layout';
import TemplateText from './TemplateText';
import { DEEP_PURPLE, GREY } from '../theme/Colors';
import TemplateCarousel from './carousels/TemplateCarousel';

export interface CarouselTab {
    name: string
    value: string
}
interface ToggleCarouselProps {
    data: CarouselTab[]
    selectedTab: CarouselTab
    onChange: (value: CarouselTab) => void

    flex?: boolean
}
const ToggleCarousel:FC<ToggleCarouselProps> = ({
    data,
    onChange,
    selectedTab,
    flex
}) => {
    const activeIndex = data?.indexOf(selectedTab);

    return (
        <TemplateCarousel
            data={data}
            flex={flex}
            renderItem={({ item }) => {
                const isSelected = item.value === selectedTab?.value;

                return (
                    <TemplateBox
                        mr={SPACE_MEDIUM}
                        alignItems="center"
                        onPress={() => onChange(item)}
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
                                    slideIn
                                    slideInDelay={1.5}
                                    slideInDirection={activeIndex > 0 ? 'right' : 'left'}
                                    animationType="spring"
                                />
                            )
                        }
                    </TemplateBox>
                );
            }}
            contentContainerStyle={styles.tabs}

        />
    );
};

const styles = StyleSheet.create({
    tabs: {
        paddingHorizontal: WRAPPER_MARGIN,
        marginVertical: SPACE_LARGE,
        justifyContent: 'center',
        alignSelf: 'center',
    },
});
export default ToggleCarousel;
