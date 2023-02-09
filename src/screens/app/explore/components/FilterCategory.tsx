import React, { FC, useState } from 'react';
import { sortBy } from 'lodash';
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
                style={SHADOW('default', WHITE)}
            >
                <TemplateText color={BLACK} bold size={18}>{title}</TemplateText>
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
                        sortBy(filters, 'name').map(({ value, name }, index) => (
                            <FilterPill
                                onPress={() => onFilterPress(value)}
                                key={value}
                                title={name}
                                fadeInDelay={(index + 1) * 100}
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
