import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { StyleSheet } from 'react-native';

import { IS_ANDROID, SCREEN_WIDTH, SPACE_XLARGE, WRAPPER_MARGIN } from '../../../../theme/Layout';
import {
    BLACK,
    BLACK_40,
    BLACK_SECONDARY,
    GREEN,
    GREY_SECONDARY,
    RED,
    WHITE,
    WHITE_96,
} from '../../../../theme/Colors';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateTextInput from '../../../../components/TemplateTextInput';
import TemplateIcon from '../../../../components/TemplateIcon';
import useAuthContext from '../../../../hooks/auth/useAuthContext';

const UpdateBrandsWorkedWith = () => {
    const refRBSheet = React.useRef();

    const [brand, setBrand] = useState({
        name: '',
        link: '',
    });

    const { auth } = useAuthContext();

    const { profile: profileData, update } = auth;

    const currentBrands = Array.isArray(profileData?.brands) ? profileData.brands : [];

    const removeBrand = index => {
        const updated = currentBrands.filter((_, i) => i !== index);
        update('brands', updated);
    };

    return (
        <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XLARGE}>
            <TemplateBox selfCenter>
                <TemplateText size={16} startCase bold>
                    Add Brands You have Worked With
                </TemplateText>
            </TemplateBox>
            <TemplateBox height={10} />
            <TemplateBox selfCenter mb={10}>
                {(Array.isArray(profileData?.brands) ? profileData.brands : [])
                    .filter(b => b && (b.name || '').trim())
                    .map((b, index) => (
                        <TemplateBox
                            key={`brand-${index}`}
                            row
                            alignItems="center"
                            justifyContent="space-between"
                            backgroundColor={WHITE}
                            borderRadius={10}
                            borderWidth={1}
                            borderColor={GREY_SECONDARY}
                            ph={16}
                            pv={12}
                            mb={8}
                            width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                        >
                            <TemplateBox flex={1} mr={10}>
                                <TemplateText size={14} bold numberOfLines={1}>
                                    {b?.name}
                                </TemplateText>
                                {!!b?.link && (
                                    <TemplateText size={11} color={BLACK_40} numberOfLines={1}>
                                        {b.link}
                                    </TemplateText>
                                )}
                            </TemplateBox>
                            <TemplateBox onPress={() => removeBrand(index)} ph={8} pv={4}>
                                <TemplateIcon name="close-circle" size={22} family="Ionicons" color={RED} />
                            </TemplateBox>
                        </TemplateBox>
                    ))}
            </TemplateBox>
            <TemplateBox
                onPress={() => {
                    refRBSheet.current.open();
                }}
                selfCenter
                row
                center
                borderRadius={10}
                borderWidth={1.5}
                borderColor={GREEN}
                pv={14}
                width={SCREEN_WIDTH - WRAPPER_MARGIN * 2}
                style={styles.addButtonDashed}
            >
                <TemplateIcon name="add-circle-outline" size={22} family="Ionicons" color={GREEN} />
                <TemplateText size={14} bold color={GREEN} style={styles.addButtonText}>
                    Add Brand
                </TemplateText>
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
                        height: 300,
                    },
                    draggableIcon: {
                        backgroundColor: BLACK,
                    },
                }}
            >
                <TemplateBox selfCenter>
                    <TemplateBox row justifyContent="space-between" mb={10}>
                        <TemplateTextInput
                            placeholder="Brand Name"
                            placeholderTextColor={BLACK_40}
                            style={styles.shortInput}
                            value={brand?.name}
                            onChangeText={text => {
                                setBrand(prev => ({ ...prev, name: text }));
                            }}
                            autoCapitalize="none"
                        />
                        <TemplateBox width={10} />
                        <TemplateTextInput
                            placeholder="Brand Link (optional)"
                            placeholderTextColor={BLACK_40}
                            style={styles.shortInput}
                            value={brand?.link}
                            onChangeText={text => {
                                setBrand(prev => ({ ...prev, link: text }));
                            }}
                            autoCapitalize="none"
                        />
                    </TemplateBox>
                    <TemplateBox
                        selfCenter
                        backgroundColor={BLACK_SECONDARY}
                        borderRadius={10}
                        ph={16}
                        pv={10}
                        mt={SPACE_XLARGE}
                        style={styles.submitButton}
                        onPress={() => {
                            if ((brand?.name || '').trim()) {
                                const newBrand = { name: brand.name.trim() };
                                if ((brand?.link || '').trim()) {
                                    newBrand.link = brand.link.trim();
                                }
                                update('brands', [...currentBrands, newBrand]);
                                setBrand({ name: '', link: '' });
                                refRBSheet.current.close();
                            }
                        }}
                    >
                        <TemplateText color={WHITE} size={12} bold caps>
                            Add Brand
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </RBSheet>
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    shortInput: {
        height: 60,
        width: SCREEN_WIDTH / 2 - WRAPPER_MARGIN * 1.4,
        borderWidth: 1,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 10,
        color: BLACK,
    },
    submitButton: {
        marginBottom: WRAPPER_MARGIN,
    },
    addButtonDashed: {
        borderStyle: 'dashed',
    },
    addButtonText: {
        marginLeft: 8,
    },
});
export default UpdateBrandsWorkedWith;
