import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FastImage from 'react-native-fast-image';
import {
    BLACK,
    BLACK_40,
    BLACK_60,
    BLUE,
    DEEP_PURPLE,
    GREY,
    GREY_SECONDARY,
    LAVENDER,
    TRANSPARENT,
    WHITE,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    IS_ANDROID,
    SCREEN_WIDTH,
    SPACE_XXLARGE,
    WRAPPED_SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import Button from '../../../components/Button';
import TemplateBox from '../../../components/TemplateBox';
import TemplateIcon from '../../../components/TemplateIcon';
import useProjects from '../../../hooks/brands/useProjects';
import Wrapper from '../../../components/Wrapper';
import CurrencyPicker from '../../../components/CurrencyPicker';
import {
    countryFilters,
    deliveryFormatFilters,
    genderFilters,
    languageFilters,
    projectDurationFilters,
    projectFilters,
    projectTypeFilters,
} from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from '../../app/explore/components/FilterCategory';
import useImageStorage from '../../../hooks/Portfolio/useImageStorage';
import useTranslation from '../../../hooks/useTranslation';
import { markReviewPromptEligibleForTrigger } from '../../../hooks/useAppReview';

const AddProjectScreen = ({ navigation, route }) => {
    // TODO: Update project feature
    // const selectedProjectId = route?.params?.selectedProjectId;
    const setRefetchProjects = route?.params?.setRefetchProjects;

    const { t } = useTranslation();
    const { update, project, createProject, loading } = useProjects();
    const [imageLoading, setImageLoading] = useState(false);

    const { onAddImage: onAddPhoto, images } = useImageStorage({ subfolder: 'projects' });

    // For future edit flow: const projectData = route?.params?.projectData;
    const projectData = null;
    const [updateImage, setUpdateImage] = useState(false);

    const latestImage = useMemo(() => {
        if (!images) return null;
        const sortedImages = images
            ?.filter(item => !!item?.contentDisposition)
            .sort((a, b) => b?.generation - a?.generation);

        return sortedImages[0];
    }, [images]);

    useEffect(() => {
        if (latestImage) {
            // Guard only when editing an existing project (not creating)
            if (projectData && !updateImage) return;
            update('image', latestImage?.url);
            setImageLoading(false);
            return;
        }

        if (projectData) update('image', projectData?.image);
    }, [latestImage]);

    const getUnfilledFields = () => {
        const { image, title, shortDescription } = project;
        const unfilledFields = [];
        if (!image?.trim()?.length) unfilledFields.push(t('brands.admin.addProject.fields.image'));
        if (!title?.trim()?.length) unfilledFields.push(t('brands.admin.addProject.fields.projectTitle'));
        if (!shortDescription?.trim()?.length)
            unfilledFields.push(t('brands.admin.addProject.fields.shortDescription'));
        return unfilledFields?.join(', ');
    };

    const handleCreateProject = async () => {
        const { image, title, shortDescription } = project;

        if (!image?.trim()?.length || !title?.trim()?.length || !shortDescription?.trim()?.length)
            return Alert.alert(t('brands.admin.addProject.alerts.fillRequired'), getUnfilledFields());

        const createdProject = await createProject(project);

        if (!createdProject) {
            return;
        }

        markReviewPromptEligibleForTrigger('brand_project_created');
        Alert.alert(
            t('brands.admin.addProject.alerts.successTitle'),
            t('brands.admin.addProject.alerts.successMessage'),
            [
                {
                    text: t('common.buttons.ok'),
                    onPress: () => {
                        navigation.goBack();
                        setRefetchProjects(new Date().toISOString());
                    },
                },
            ],
        );
    };

    return (
        <Wrapper contentContainerStyle={styles.contentContainer} style={styles.container} keyboard safe={false}>
            <TemplateBox height={HEADER_MARGIN} />
            <TemplateBox selfCenter mv={WRAPPER_MARGIN}>
                <TemplateText bold color={BLACK} size={18} startCase center>
                    {t('brands.admin.addProject.title')}
                </TemplateText>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.projectTitle')}</TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.admin.addProject.placeholders.projectTitle')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.title}
                    onChangeText={text => update('title', text)}
                    autoCapitalize="none"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.shortDescription')}</TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.admin.addProject.placeholders.shortDescription')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.shortDescription}
                    onChangeText={text => update('shortDescription', text)}
                    autoCapitalize="none"
                    numberOfLines={6}
                    maxLength={80}
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.description')}</TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.admin.addProject.placeholders.description')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.description}
                    onChangeText={text => update('description', text)}
                    autoCapitalize="none"
                    multiline
                    numberOfLines={6}
                    maxLength={500}
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.link')}</TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.admin.addProject.placeholders.link')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.link}
                    onChangeText={text => update('link', text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE} selfCenter>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.startDate')}</TemplateText>
                <TemplateBox width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} selfCenter>
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
                <TemplateText size={16}>{t('brands.admin.addProject.fields.endDate')}</TemplateText>
                <TemplateBox width={SCREEN_WIDTH - WRAPPER_MARGIN * 2} selfCenter>
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
                <TemplateBox row alignItems="center">
                    <TemplateText size={16}>
                        {t('brands.admin.addProject.fields.image')}
                        <TemplateText size={12} ml={10} color={GREY}>
                            {t('brands.admin.addProject.required')}
                        </TemplateText>
                    </TemplateText>
                    {imageLoading && <ActivityIndicator size="small" color={BLUE} style={styles.imageLoader} />}
                </TemplateBox>
                <TemplateBox height={10} />
                <TemplateBox
                    width={WRAPPED_SCREEN_WIDTH}
                    borderRadius={12}
                    overflow="hidden"
                    onPress={() => {
                        if (project?.image) {
                            Alert.alert(t('brands.admin.addProject.image.replaceConfirm'), '', [
                                {
                                    text: t('common.actions.cancel'),
                                    style: 'cancel',
                                },
                                {
                                    text: t('common.buttons.ok'),
                                    onPress: () => {
                                        setImageLoading(true);
                                        setUpdateImage(true);
                                        onAddPhoto();
                                    },
                                },
                            ]);
                        } else {
                            setImageLoading(true);
                            onAddPhoto();
                        }
                    }}
                >
                    {project?.image ? (
                        <TemplateBox>
                            <FastImage
                                source={{ uri: project?.image }}
                                style={styles.projectCoverImage}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <TemplateBox style={styles.imageOverlay} row alignItems="center" justifyContent="center">
                                <TemplateIcon name="camera-outline" size={18} color={WHITE} />
                                <TemplateBox width={6} />
                                <TemplateText size={14} color={WHITE} semiBold>
                                    {t('brands.admin.addProject.image.replaceInstruction')}
                                </TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    ) : (
                        <TemplateBox style={styles.imagePlaceholder} alignItems="center" justifyContent="center">
                            <TemplateIcon name="camera-outline" size={36} color={GREY} />
                            <TemplateBox height={8} />
                            <TemplateText size={15} color={BLACK} semiBold>
                                {t('brands.admin.addProject.image.addInstruction')}
                            </TemplateText>
                            <TemplateText size={12} color={GREY} mt={4}>
                                {t('brands.admin.addProject.image.tapToUpload')}
                            </TemplateText>
                        </TemplateBox>
                    )}
                </TemplateBox>
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.maxBudget')}</TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.admin.addProject.placeholders.maxBudget')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.priceRange?.max}
                    onChangeText={text =>
                        update('priceRange', {
                            min: project?.priceRange?.min,
                            max: text,
                        })
                    }
                    keyboardType="numeric"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.minBudget')}</TemplateText>
                <TemplateTextInput
                    placeholder={t('brands.admin.addProject.placeholders.minBudget')}
                    placeholderTextColor={BLACK_40}
                    style={styles.input}
                    value={project?.priceRange?.min}
                    onChangeText={text =>
                        update('priceRange', {
                            min: text,
                            max: project?.priceRange?.max,
                        })
                    }
                    keyboardType="numeric"
                />
            </TemplateBox>

            <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                <TemplateText size={16}>{t('brands.admin.addProject.fields.currency')}</TemplateText>
                <TemplateBox height={10} />
                <CurrencyPicker
                    value={project?.currency?.code}
                    onSelectCurrency={value => {
                        update('currency', {
                            code: value?.code,
                            symbol: value?.symbol,
                        });
                    }}
                />
            </TemplateBox>

            <FilterCategory
                title={t('brands.admin.addProject.categories.deliveryFormat')}
                filters={deliveryFormatFilters}
                onFilterPress={value => {
                    if (project?.deliveryFormat.includes(value)) {
                        const newDeliveryFormat = project?.deliveryFormat.filter(item => item !== value);
                        return update('deliveryFormat', newDeliveryFormat);
                    }
                    update('deliveryFormat', [...project?.deliveryFormat, value]);
                }}
                selectedFilters={project?.deliveryFormat}
                translationPrefix="filterDeliveryFormats"
            />
            <FilterCategory
                title={t('brands.admin.addProject.categories.projectType')}
                filters={projectTypeFilters}
                onFilterPress={value => {
                    if (project?.projectType.includes(value)) {
                        const newProjectType = project?.projectType.filter(item => item !== value);
                        return update('projectType', newProjectType);
                    }
                    update('projectType', [...project?.projectType, value]);
                }}
                selectedFilters={project?.projectType}
                translationPrefix="filterProjectTypes"
            />
            <FilterCategory
                title={t('brands.admin.addProject.categories.projectCategories')}
                filters={projectFilters}
                onFilterPress={value => {
                    if (project?.categories.includes(value)) {
                        const newProjectCategories = project?.categories.filter(item => item !== value);
                        return update('categories', newProjectCategories);
                    }
                    update('categories', [...project?.categories, value]);
                }}
                selectedFilters={project?.categories}
                translationPrefix="filterCategories"
            />
            <FilterCategory
                title={t('brands.admin.addProject.categories.country')}
                filters={countryFilters}
                onFilterPress={value => {
                    if (project?.countries.includes(value)) {
                        const newCountries = project?.countries.filter(item => item !== value);
                        return update('countries', newCountries);
                    }
                    update('countries', [...project?.countries, value]);
                }}
                selectedFilters={project?.countries}
                translationPrefix="filterCountries"
            />
            <FilterCategory
                title={t('brands.admin.addProject.categories.language')}
                filters={languageFilters}
                onFilterPress={value => {
                    if (project?.languages.includes(value)) {
                        const newLanguages = project?.languages.filter(item => item !== value);
                        return update('languages', newLanguages);
                    }
                    update('languages', [...project?.languages, value]);
                }}
                selectedFilters={project?.languages}
                translationPrefix="filterLanguages"
            />
            <FilterCategory
                title={t('brands.admin.addProject.categories.gender')}
                filters={genderFilters}
                onFilterPress={value => {
                    if (project?.gender.includes(value)) {
                        const newGenders = project?.gender.filter(item => item !== value);
                        return update('gender', newGenders);
                    }
                    update('gender', [...project?.gender, value]);
                }}
                selectedFilters={project?.gender}
                translationPrefix="filterGenders"
            />
            <FilterCategory
                title={t('brands.admin.addProject.categories.projectDuration')}
                filters={projectDurationFilters}
                onFilterPress={value => {
                    if (project?.duration.includes(value)) {
                        const newDuration = project?.duration.filter(item => item !== value);
                        return update('duration', newDuration);
                    }
                    update('duration', [...project?.duration, value]);
                }}
                selectedFilters={project?.duration}
                translationPrefix="filterProjectDurations"
            />
            <Button
                title={t('brands.admin.addProject.buttons.create')}
                onPress={handleCreateProject}
                style={styles.button}
                loading={loading}
                disabled={false}
                height={50}
                width={SCREEN_WIDTH - 40}
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
        borderRadius: 40,
        paddingLeft: 16,
        marginTop: 10,
        color: DEEP_PURPLE,
    },
    button: {
        marginTop: 20,
        marginBottom: 50,
        alignSelf: 'center',
    },
    projectCoverImage: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: BLACK_60,
        paddingVertical: 10,
    },
    imagePlaceholder: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderWidth: 1.5,
        borderColor: GREY_SECONDARY,
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: LAVENDER,
    },
    imageLoader: {
        marginLeft: 8,
    },
});
export default AddProjectScreen;
