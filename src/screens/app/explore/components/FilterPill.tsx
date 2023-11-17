import React, { FC, useState } from 'react';
import PillTag from '../../../../components/PillTag';

interface Props {
    title: string
    onPress: () => void
    fadeInDelay?: number
    selected: boolean
    noMargin?: boolean
}
const FilterPill: FC<Props> = ({
    title, onPress, fadeInDelay, selected, noMargin = false,
}) => {
    const handelPress = () => {
        onPress();
    };

    return (
        <PillTag
            primaryTransparent={!selected}
            noMargin={noMargin}
            onPress={handelPress}
            showClose={selected}
            fadeInDelay={fadeInDelay}
        >
            {title}
        </PillTag>
    );
};

export default FilterPill;
