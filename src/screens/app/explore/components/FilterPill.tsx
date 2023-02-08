import React, { FC, useState } from 'react';
import PillTag from '../../../../components/PillTag';

interface Props {
    title: string
    onPress: () => void

    fadeInDelay?: number

    selected: boolean

}
const FilterPill: FC<Props> = ({
    title, onPress, fadeInDelay, selected
}) => {
    const handelPress = () => {
        onPress();
    };

    return (
        <PillTag
            primaryTransparent={!selected}
            noMargin={false}
            onPress={handelPress}
            showClose={selected}
            fadeInDelay={fadeInDelay}
        >
            {title}
        </PillTag>
    );
};

export default FilterPill;
