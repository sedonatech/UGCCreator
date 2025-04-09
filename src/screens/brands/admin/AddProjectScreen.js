import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FastImage from 'react-native-fast-image';
import {
    BLACK, BLACK_40, BLUE, DEEP_PURPLE, GREY_SECONDARY, PRIMARY, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_WIDTH, SPACE_XXLARGE,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import Button from '../../../components/Button';
import TemplateBox from '../../../components/TemplateBox';
import useProjects from '../../../hooks/brands/useProjects';
import Wrapper from '../../../components/Wrapper';
import CurrencyPicker from '../../../components/CurrencyPicker';
import {
    countryFilters,
    deliveryFormatFilters, genderFilters,
    languageFilters, projectDurationFilters, projectFilters,
    projectTypeFilters,
} from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from '../../app/explore/components/FilterCategory';
import AddButtonLargeSvg from '../../../../assets/svgs/AddButtonLargeSvg';
import useImageStorage from '../../../hooks/Portfolio/useImageStorage';
import { wp } from '../../../Utils/getResponsiveSize';

const AddProjectScreen = ({ navigation, route }) => {
    // TODO: Update project feature
    // const selectedProjectId = route?.params?.selectedProjectId;
    const setRefetchProjects = route?.params?.setRefetchProjects;

    const {
        update, project, createProject, loading,
    } = useProjects();
    const [imageLoading, setImageLoading] = useState(false);

    const { onAddImage: onAddPhoto, images } = useImageStorage();

    const latestImage = useMemo(() => {
        if (!images) return null;
        const sortedImages = images
            ?.filter((item) => !!item?.contentDisposition)
            .sort((a, b) => b?.generation - a?.generation);
        setImageLoading(false);
        return sortedImages[0];
    }, [images]);

    useEffect(() => {
        if (latestImage) {
            update('image', latestImage?.url);
        }
    }, [latestImage]);

    const getUnfilledFields = () => {
        const {
            image, title, shortDescription,
        } = project;
        const unfilledFields = [];
        if (!image?.trim()?.length) unfilledFields.push('Image');
        if (!title?.trim()?.length) unfilledFields.push('Title');
        if (!shortDescription?.trim()?.length) unfilledFields.push('Short Description');
        return unfilledFields?.join(', ');
    };

    const handleCreateProject = () => {
        const {
            image, title, shortDescription,
        } = project;

        if (
            !image?.trim()?.length
            || !title?.trim()?.length
            || !shortDescription?.trim()?.length
        ) return Alert.alert('Please fill all required fields:', getUnfilledFields());

        createProject(project);
        Alert.alert('Project created successfully',
            'You can view your project in the projects section',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.goBack();
                        setRefetchProjects(new Date().toISOString());
                    },
                },
            ]);
    };

    return (
        <Wrapper
            contentContainerStyle={styles.contentContainer}
            style={styles.container}
            keyboard
            safe={false}
        >
            <TemplateBox height={HEADER_MARGIN} />
            <TemplateBox selfCenter mv={WRAPPER_MARGIN}>
                <TemplateText
                    bold
                    color={BLACK}
                    size={18}
                    startCase
                    center
                >
                    Add a new project
                </TemplateText>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Project Title</TemplateText>
                <TemplateTextInput
                    placeholder="Project Title"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.title}
                    onChangeText={(text) => update('title', text)}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Short Description</TemplateText>
                <TemplateTextInput
                    placeholder="Short description"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.shortDescription}
                    onChangeText={(text) => update('shortDescription', text)}
                    autoCapitalize="none"
                    multiline
                    numberOfLines={6}
                    maxLength={80}
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Description</TemplateText>
                <TemplateTextInput
                    placeholder="Description"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.description}
                    onChangeText={(text) => update('description', text)}
                    autoCapitalize="none"
                    multiline
                    numberOfLines={6}
                    maxLength={500}
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE} selfCenter>
                <TemplateText size={16}>Start Date</TemplateText>
                <TemplateBox width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)} selfCenter>
                    <DateTimePicker
                        value={project?.startDate || new Date()}
                        mode="date"
                        display="inline"
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || project?.startDate;
                            update('startDate', currentDate);
                        }}
                        textColor={BLACK_40}
                        themeVariant="light"
                    />
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE} selfCenter>
                <TemplateText size={16}>End Date</TemplateText>
                <TemplateBox width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)} selfCenter>
                    <DateTimePicker
                        value={project?.endDate || new Date()}
                        mode="date"
                        display="inline"
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || project?.endDate;
                            update('endDate', currentDate);
                        }}
                        textColor={BLACK_40}
                        themeVariant="light"
                    />
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateBox row>
                    <TemplateText size={16} mr={5}>Image</TemplateText>
                    {imageLoading && <ActivityIndicator size="small" color={BLUE} />}
                </TemplateBox>
                <TemplateBox height={10} />
                {latestImage?.url && (
                    <TemplateBox height={120} width={120} borderRadius={10}>
                        <FastImage
                            source={{ uri: latestImage?.url }}
                            style={styles.image}
                        />
                    </TemplateBox>
                )}

                <TemplateBox height={10} />
                <TemplateBox
                    onPress={() => {
                        if (project?.image) {
                            Alert.alert('Are you sure you want to replace the image?', '', [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        setImageLoading(true);
                                        onAddPhoto();
                                    },
                                },
                            ]);
                            return;
                        }
                        onAddPhoto();
                    }}
                    mt={SPACE_XXLARGE}
                >
                    <AddButtonLargeSvg width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} />
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Maximum Budget</TemplateText>
                <TemplateTextInput
                    placeholder="Maximum Budget limit"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.priceRange?.max}
                    onChangeText={(text) => update('priceRange', {
                        min: project?.priceRange?.min,
                        max: text,
                    })}
                    keyboardType="numeric"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Minimum Budget</TemplateText>
                <TemplateTextInput
                    placeholder="Minimum Budget limit"
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.priceRange?.min}
                    onChangeText={(text) => update('priceRange', {
                        min: text,
                        max: project?.priceRange?.max,
                    })}
                    keyboardType="numeric"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>Currency</TemplateText>
                <TemplateBox height={10} />
                <CurrencyPicker
                    value={project?.currency?.code}
                    onSelectCurrency={(value) => {
                        update('currency', {
                            code: value?.code,
                            symbol: value?.symbol,
                        });
                    }}
                />
            </TemplateBox>

            <FilterCategory
                title="Delivery Format"
                filters={deliveryFormatFilters}
                onFilterPress={(value) => {
                    if (project?.deliveryFormat.includes(value)) {
                        const newDeliveryFormat = project
                            ?.deliveryFormat.filter((item) => item !== value);
                        return update('deliveryFormat', newDeliveryFormat);
                    }
                    update('deliveryFormat',
                        [...project?.deliveryFormat, value]);
                }}
                selectedFilters={project?.deliveryFormat}

            />
            <FilterCategory
                title="Project Type"
                filters={projectTypeFilters}
                onFilterPress={(value) => {
                    if (project?.projectType.includes(value)) {
                        const newProjectType = project
                            ?.projectType.filter((item) => item !== value);
                        return update('projectType', newProjectType);
                    }
                    update('projectType',
                        [...project?.projectType, value]);
                }}
                selectedFilters={project?.projectType}
            />
            <FilterCategory
                title="Project Categories"
                filters={projectFilters}
                onFilterPress={(value) => {
                    if (project?.categories.includes(value)) {
                        const newProjectCategories = project
                            ?.categories.filter((item) => item !== value);
                        return update('categories', newProjectCategories);
                    }
                    update('categories',
                        [...project?.categories, value]);
                }}
                selectedFilters={project?.categories}
            />
            <FilterCategory
                title="Country"
                filters={countryFilters}
                onFilterPress={(value) => {
                    if (project?.countries.includes(value)) {
                        const newCountries = project
                            ?.countries.filter((item) => item !== value);
                        return update('countries', newCountries);
                    }
                    update('countries',
                        [...project?.countries, value]);
                }}
                selectedFilters={project?.countries}
            />
            <FilterCategory
                title="Language"
                filters={languageFilters}
                onFilterPress={(value) => {
                    if (project?.languages.includes(value)) {
                        const newLanguages = project
                            ?.languages.filter((item) => item !== value);
                        return update('languages', newLanguages);
                    }
                    update('languages',
                        [...project?.languages, value]);
                }}
                selectedFilters={project?.languages}
            />
            <FilterCategory
                title="Gender"
                filters={genderFilters}
                onFilterPress={(value) => {
                    if (project?.gender.includes(value)) {
                        const newGenders = project
                            ?.gender.filter((item) => item !== value);
                        return update('gender', newGenders);
                    }
                    update('gender',
                        [...project?.gender, value]);
                }}
                selectedFilters={project?.gender}
            />
            <FilterCategory
                title="Project Duration"
                filters={projectDurationFilters}
                onFilterPress={(value) => {
                    if (project?.duration.includes(value)) {
                        const newDuration = project
                            ?.duration.filter((item) => item !== value);
                        return update('duration', newDuration);
                    }
                    update('duration',
                        [...project?.duration, value]);
                }}
                selectedFilters={project?.duration}
            />
            <Button
                title="Create Project"
                onPress={handleCreateProject}
                style={styles.button}
                loading={loading}
                disabled={false}
            />
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        paddingBottom: SPACE_XXLARGE,
    },
    contentContainer: {
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    input: {
        height: 60,
        borderWidth: 1,
        width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 10,
        color: DEEP_PURPLE,
    },
    button: {
        marginTop: 20,
        marginBottom: 50,
        alignSelf: 'center',
    },
    image: {
        width: wp(120),
        height: wp(120),
        borderRadius: wp(10),
    },
});
export default AddProjectScreen;
