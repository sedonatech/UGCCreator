import { ScrollView, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import React, { useState } from 'react';
import {
    IS_ANDROID, SCREEN_HEIGHT, SCREEN_WIDTH, SPACE_XLARGE, SPACE_XSMALL, WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import {
    BLACK, GREEN, WHITE, WHITE_96,
} from '../../../../theme/Colors';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import FilterCategory from '../../explore/components/FilterCategory';
import {
    ageFilters,
    deliveryFormatFilters,
    genderFilters,
    languageFilters, projectDurationFilters,
    projectFilters, projectTypeFilters,
} from '../../../../consts/AppFilters/ProjectFilters';
import AddButtonLargeSvg from '../../../../../assets/svgs/AddButtonLargeSvg';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import PillTag from '../../../../components/PillTag';

const UpdateCategories = () => {
    const refRBSheet = React.useRef();

    const { auth } = useAuthContext();

    const { profile: profileData, update } = auth;

    const [selectedFilters, setSelectedFilters] = useState([]);

    const onProjectFilterPress = (value) => {
        if (selectedFilters.includes(value)) {
            setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
        } else {
            setSelectedFilters([...selectedFilters, value]);
        }
    };

    return (
        <TemplateBox mv={SPACE_XLARGE}>
            <TemplateBox selfCenter mb={10}>
                <TemplateText size={16} bold>Select your Preferred content categories</TemplateText>
            </TemplateBox>
            <TemplateBox row flexWrap="wrap">
                {profileData?.categories?.map((category) => (
                    <PillTag
                        key={category}
                        showClose
                        primaryTransparent
                        onPress={() => {
                            update('categories', profileData?.categories?.filter((cat) => cat !== category));
                        }}
                    >
                        {category}
                    </PillTag>
                ))}
            </TemplateBox>
            <TemplateBox height={10} />
            <TemplateBox
                onPress={() => {
                    refRBSheet.current.open();
                }}
                selfCenter
            >
                <AddButtonLargeSvg width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} />
            </TemplateBox>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                closeOnPressMask
                customStyles={{
                    wrapper: {

                        blurType: 'dark',
                        blurAmount: 10,
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: IS_ANDROID ? WHITE_96 : WHITE,
                        paddingTop: 10,
                        paddingBottom: 40,
                        height: SCREEN_HEIGHT * 0.7,
                    },
                    draggableIcon: {
                        backgroundColor: BLACK,
                    },
                }}
            >

                <ScrollView>
                    <TemplateBox
                        mb={WRAPPER_MARGIN}
                        mt={SPACE_XSMALL}
                        alignItems="center"
                        justifyContent="center"
                        row
                    >
                        <TemplateText size={18} bold>Select Categories</TemplateText>

                        {selectedFilters.length > 0 && (
                            <TemplateText
                                size={12}
                                bold
                                color={GREEN}
                                style={styles.applyText}
                                onPress={() => {
                                    update('categories', selectedFilters);
                                    refRBSheet.current.close();
                                }}
                            >
                                Add Categories
                            </TemplateText>
                        )}

                        {selectedFilters.length > 0 && (
                            <TemplateText
                                size={12}
                                bold
                                color={GREEN}
                                style={styles.applyText}
                                onPress={() => {
                                    setSelectedFilters([]);
                                    refRBSheet.current.close();
                                }}
                            >
                                Clear All
                            </TemplateText>
                        )}
                    </TemplateBox>

                    <FilterCategory
                        title="Project Category"
                        filters={projectFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Language"
                        filters={languageFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Gender"
                        filters={genderFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Age Group"
                        filters={ageFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Project Type"
                        filters={projectTypeFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Delivery Format"
                        filters={deliveryFormatFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />
                    <FilterCategory
                        title="Project Duration"
                        filters={projectDurationFilters}
                        onFilterPress={onProjectFilterPress}
                        selectedFilters={selectedFilters}
                    />

                </ScrollView>

            </RBSheet>
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    applyText: {
        marginLeft: WRAPPER_MARGIN,
    },
});
export default UpdateCategories;
