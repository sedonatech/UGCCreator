import React, { FC, useMemo, useState } from 'react';
import { ProjectFilters } from '../../../../consts/AppFilters/ProjectFilters';
import {
    RADIUS_SMALL, SPACE_MEDIUM, SPACE_SMALL, WRAPPED_SCREEN_WIDTH,
} from '../../../../theme/Layout';
import FilterPill from './FilterPill';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { BLACK, GREY_30, LAVENDER } from '../../../../theme/Colors';
import TemplateIcon from '../../../../components/TemplateIcon';
import TemplateTextInput from '../../../../components/TemplateTextInput';
import { StyleSheet } from 'react-native';

interface Props {
    title: string
    filters: ProjectFilters[]
    onFilterPress: (value: string) => void
    selectedFilters?: string[],
    showDefaultOptions?: boolean
}

const DropdownSearch: FC<Props> = ({
    title,
    filters,
    onFilterPress,
    selectedFilters = [],
    showDefaultOptions = false
}) => {
    const [toggleFilters, setToggleFilters] = useState(false);  
    const [search, setSearch] = useState('')
    const filteredFilters = useMemo(()=> filters?.filter((filter)=>  filter?.name?.toLowerCase().startsWith(search.toLowerCase())) ,[filters,search])

    return (
        <TemplateBox>
            <TemplateBox
                row
                alignItems="center"
                justifyContent="space-between"
                pAll={SPACE_MEDIUM}
                width={WRAPPED_SCREEN_WIDTH}
                borderRadius={RADIUS_SMALL}
                backgroundColor={LAVENDER}
                mb={SPACE_SMALL}
                selfCenter
                onPress={() => setToggleFilters((prevState) => !prevState)}
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
                <>
                 <TemplateBox row alignItems="center" >
                 <TemplateTextInput
                     placeholder="Search"
                     style={[styles.input]}
                     value={search}
                     onChangeText={(text) => setSearch(text)}
                     autoCapitalize="none"
                 />
             </TemplateBox>
                <TemplateBox row flexWrap="wrap" pAll={SPACE_SMALL}>
                     {
                        (search?.length > 1 || showDefaultOptions) && filteredFilters?.map(({ value, name }, index) => (
                            <FilterPill
                                onPress={() => {
                                    onFilterPress(value)
                                    setToggleFilters((prevState) => !prevState)
                                }}
                                key={value + index}
                                title={name}
                                selected={selectedFilters?.includes(value)}
                            />
                        ))
                    }
                </TemplateBox>
                </>
            )}
        </TemplateBox>
    );
};
export default DropdownSearch;

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingRight: 30,
        paddingLeft: 10,
        fontSize: 16,
        color: BLACK,
        backgroundColor: GREY_30
    },
})
