import React, { useEffect, useState, useRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    get, isEmpty, map, size, filter, uniq,
} from 'lodash';

import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import {
    IS_ANDROID, SCREEN_WIDTH, SPACE_XLARGE, WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import AddButtonLargeSvg from '../../../../../assets/svgs/AddButtonLargeSvg';
import {
    BLACK, BLACK_40, WHITE, WHITE_96,
} from '../../../../theme/Colors';
import useImageStorage from '../../../../hooks/Portfolio/useImageStorage';
import useFirebaseDeleteStorage from '../../../../hooks/imageUpload/useFirebaseDeleteStorage';
import AddSampleWorkItem from './AddSampleWorkItem';

const imageLimit = 1;
const UpdateWorkExamples = () => {
    const refRBSheet = useRef();

    const [customOptions, setCustomOptions] = useState({ maxFiles: imageLimit, multiple: true });

    const [images, setImages] = useState(Array.from(Array(imageLimit).keys()).map(() => null));

    const { onAddImage: onAddPhoto, images: imagesFromStorage } = useImageStorage();

    const { deleteImage } = useFirebaseDeleteStorage();

    useEffect(() => {
        const newImages = [...images];
        const newImagesFromStorage = [...imagesFromStorage];
        const filteredImages = filter(newImagesFromStorage,
            (item) => !isEmpty(item)
            && !isEmpty(item?.url)
            && !item?.url?.includes('true'));
        const uniqImages = uniq(filteredImages);
        const newImagesFromStorageSize = size(uniqImages);
        const newImagesSize = size(newImages);
        const newImagesFromStorageWithNull = Array.from(Array(
            newImagesSize - newImagesFromStorageSize,
        )?.keys())?.map(() => null);
        const newImagesFromStorageWithNullAndImages = [
            ...uniqImages,
            ...newImagesFromStorageWithNull,
        ];
        setImages(newImagesFromStorageWithNullAndImages);
    }, [imagesFromStorage]);

    const handleClearImage = async (index, item) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        newImages.push(null);
        setCustomOptions({ ...customOptions, maxFiles: customOptions.maxFiles + 1 });
        setImages(newImages);
        await deleteImage({ item, skipAlert: false });
    };

    return (
        <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XLARGE}>
            <TemplateBox selfCenter>
                <TemplateText size={16} startCase>Upload your sample photos/videos</TemplateText>
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
                        height: 700,
                    },
                    draggableIcon: {
                        backgroundColor: BLACK,
                    },
                }}
            >
                <ScrollView>
                    <TemplateBox>
                        <TemplateBox selfCenter alignItems="center">
                            <TemplateText
                                bold
                                size={18}
                                color={BLACK}
                                center
                            >
                                Upload sample photos
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={12}
                                color={BLACK_40}
                                center
                            >
                                You can upload up to 4 variants of your work
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox pAll={WRAPPER_MARGIN}>
                            {!!images?.length && !isEmpty(images) && map(images, ((item, index) => (
                                <AddSampleWorkItem
                                    key={index}
                                    image={get(item, 'url', null)}
                                    index={index}
                                    onSelectImage={() => {
                                        console.log('item', item);
                                        if (!get(item, 'url', null)) onAddPhoto();
                                    }}
                                    handleClearImage={() => handleClearImage(index, item)}
                                    onClose={() => refRBSheet.current.close()}
                                    style={styles.addButton}
                                />
                            )))}
                        </TemplateBox>
                    </TemplateBox>

                    <TemplateBox>
                        <TemplateBox selfCenter alignItems="center">
                            <TemplateText
                                bold
                                size={18}
                                color={BLACK}
                                center
                            >
                                Upload sample videos
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={12}
                                color={BLACK_40}
                                center
                            >
                                You can upload up to 4 variants of your video samples
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox pAll={WRAPPER_MARGIN}>
                            {!!images?.length && !isEmpty(images) && map(images, ((item, index) => (
                                <AddSampleWorkItem
                                    key={index}
                                    image={get(item, 'url', null)}
                                    index={index}
                                    onSelectImage={() => {
                                        console.log('item', item);
                                        if (!get(item, 'url', null)) onAddPhoto();
                                    }}
                                    handleClearImage={() => handleClearImage(index, item)}
                                    onClose={() => refRBSheet.current.close()}
                                    style={styles.addButton}
                                />
                            )))}
                        </TemplateBox>
                    </TemplateBox>
                </ScrollView>
            </RBSheet>
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    addButton: {
        marginHorizontal: WRAPPER_MARGIN,
        marginBottom: WRAPPER_MARGIN,
    },
});
export default UpdateWorkExamples;
