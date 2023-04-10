import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { StyleSheet } from 'react-native';
import { LinkPreview } from '@flyerhq/react-native-link-preview';

import {
    IS_ANDROID, SCREEN_WIDTH, SPACE_XLARGE, WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import {
    BLACK, BLACK_40, BLACK_SECONDARY, GREY_SECONDARY, WHITE, WHITE_96,
} from '../../../../theme/Colors';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateTextInput from '../../../../components/TemplateTextInput';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import AddButtonLargeSvg from '../../../../../assets/svgs/AddButtonLargeSvg';
import BrandsCard from '../../home/components /BrandsCard';

const UpdateBrandsWorkedWith = () => {
    const refRBSheet = React.useRef();

    const [brand, setBrand] = useState({
        name: '',
        link: '',
    });

    const { auth } = useAuthContext();

    const { profile: profileData, update } = auth;

    return (
        <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XLARGE}>
            <TemplateBox selfCenter>
                <TemplateText size={16} startCase bold>Add Brands You have Worked With</TemplateText>
            </TemplateBox>
            <TemplateBox height={10} />
            <TemplateBox selfCenter mb={10}>
                {profileData?.brands?.map((b) => (

                    <LinkPreview
                        text={b?.link}
                        enableAnimation
                        renderLinkPreview={({
                            previewData,
                        }) => (
                            <BrandsCard
                                image={{ uri: previewData?.image?.url }}
                                title={previewData?.title}
                                shortDescription={previewData?.description}
                                cardWidth={SCREEN_WIDTH / 1.12}
                                aspectRatio={1.8}
                                onPress={() => {
                                    const brands = profileData
                                        ?.brands?.filter((br) => br?.link !== b?.link);
                                    update('brands', brands);
                                    setBrand({
                                        name: '',
                                        link: '',
                                    });
                                }}
                                buttonTitle="Remove"
                                style={styles.brandCard}
                                slideIn
                                slideInDuration={500}
                            />
                        )}
                    />

                ))}
            </TemplateBox>
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
                            onChangeText={(text) => {
                                const data = {
                                    name: text,
                                    link: brand?.link || '',
                                };
                                setBrand(data);
                            }}
                            autoCapitalize="none"
                        />
                        <TemplateBox width={10} />
                        <TemplateTextInput
                            placeholder="Brand Link"
                            placeholderTextColor={BLACK_40}
                            style={styles.shortInput}
                            value={brand?.link}
                            onChangeText={(text) => {
                                const data = {
                                    name: brand?.name || '',
                                    link: text,
                                };
                                setBrand(data);
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
                        style={styles.brandCard}
                        onPress={() => {
                            if (brand?.name && brand?.link) {
                                update('brands', [...profileData?.brands, brand]);
                                setBrand({
                                    name: '',
                                    link: '',
                                });
                                refRBSheet.current.close();
                            }
                        }}
                    >

                        <TemplateText color={WHITE} size={12} bold caps>Add Brand</TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </RBSheet>
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    shortInput: {
        height: 60,
        width: (SCREEN_WIDTH / 2) - WRAPPER_MARGIN * 1.4,
        borderWidth: 1,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 10,
        color: BLACK_40,
    },
    brandCard: {
        marginBottom: WRAPPER_MARGIN,
    },
});
export default UpdateBrandsWorkedWith;
