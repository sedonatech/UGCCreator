import React, {
    useState, forwardRef, LegacyRef, MutableRefObject
} from 'react';
import {
    StyleSheet, FlatList, FlatListProps, ViewStyle,
} from 'react-native';
import TemplatePagination from './TemplatePagination';

import TemplateBox from '../TemplateBox';
import { SCREEN_WIDTH } from '../../theme/Layout';

export interface TemplateCarouselProps extends FlatListProps<any> { // Fix <any> type here
    style?: ViewStyle,
    showPagination?: boolean,
    contentContainerStyle?: ViewStyle | (ViewStyle | false)[],
    flex?: number | boolean,
    paginationSize?: number,
    refField?: MutableRefObject<any> | null
    onShowAllPress?: (()=>void) | null,
}

type RefType = LegacyRef<FlatList>;

const TemplateCarousel:React.FC<TemplateCarouselProps> = forwardRef(({
    style,
    showPagination,
    children,
    flex,
    paginationSize,
    snapToInterval,
    refField,
    onShowAllPress,
    ...restProps
}, ref:RefType) => {
    const [activeIndex, setActiveIndex] = useState(0);
    // @ts-ignore
    return (
        <TemplateBox flex={flex}>
            <FlatList
                ref={refField || ref}
                horizontal
                snapToInterval={snapToInterval}
                decelerationRate="fast"
                disableIntervalMomentum
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}
                style={[styles.container, style]}
                scrollEventThrottle={16}
                onScroll={(event) => {
                    const { nativeEvent: { contentOffset: { x: offset = 0 }} } = event;
                    const newIndex = offset / (snapToInterval || SCREEN_WIDTH);
                    setActiveIndex(Math.round(newIndex));
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...restProps}
            />

            {showPagination && (
                <TemplatePagination
                    paginationSize={paginationSize || 0}
                    position={activeIndex}
                />
            )}

        </TemplateBox>
    );
});

export default TemplateCarousel;

TemplateCarousel.defaultProps = {
    flex: false,
    showPagination: false,
    contentContainerStyle: {},
    paginationSize: 0,
    refField: null
};

const styles = StyleSheet.create({
    container: {
        // width: '100%',
    },
});
