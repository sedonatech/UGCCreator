import React, { FC, useState } from 'react';
import { ProjectFilters } from '../../../../consts/AppFilters/ProjectFilters';
import {
    RADIUS_SMALL, SPACE_LARGE, SPACE_MEDIUM, SPACE_SMALL, SPACE_XSMALL, WRAPPED_SCREEN_WIDTH
} from '../../../../theme/Layout';
import FilterPill from './FilterPill';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { BLACK, WHITE } from '../../../../theme/Colors';
import TemplateIcon from '../../../../components/TemplateIcon';
import { SHADOW } from '../../../../theme/Shadow';

interface Props {
    title: string
    filters: ProjectFilters[]
    onFilterPress: (value: string) => void
    selectedFilters?: string[]
}

const FilterCategory: FC<Props> = ({
    title,
    filters,
    onFilterPress,
    selectedFilters = [],
}) => {
    const [toggleFilters, setToggleFilters] = useState(false);

    return (
        <TemplateBox>
            <TemplateBox
                row
                alignItems="center"
                justifyContent="space-between"
                pAll={SPACE_MEDIUM}
                width={WRAPPED_SCREEN_WIDTH}
                borderRadius={RADIUS_SMALL}
                backgroundColor={WHITE}
                mb={SPACE_LARGE}
                selfCenter
                onPress={() => setToggleFilters((prevState) => !prevState)}
                style={SHADOW('mediumCard', WHITE)}
            >
                <TemplateText color={BLACK} semiBold size={16}>{title}</TemplateText>
                <TemplateIcon
                    name={toggleFilters
                        ? 'chevron-up-outline'
                        : 'chevron-down-outline'}
                    color={BLACK}
                    size={24}
                />
            </TemplateBox>
            {toggleFilters && (
                <TemplateBox row flexWrap="wrap" pAll={SPACE_SMALL}>
                    {
                        filters?.sort((a, b) => a?.name?.localeCompare(b.name)).map(({ value, name }, index) => (
                            <FilterPill
                                onPress={() => onFilterPress(value)}
                                key={value}
                                title={name}
                                fadeInDelay={(index + 1) * 50}
                                selected={selectedFilters?.includes(value)}
                            />
                        ))
                    }
                </TemplateBox>
            )}
        </TemplateBox>
    );
};
export default FilterCategory;
