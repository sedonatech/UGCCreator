import React, { useRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';

import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import {
    IS_ANDROID, SCREEN_WIDTH, SPACE_XLARGE, WRAPPER_MARGIN,
} from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import AddButtonLargeSvg from '../../../../../assets/svgs/AddButtonLargeSvg';
import {
    BLACK, WHITE, WHITE_96,
} from '../../../../theme/Colors';
import AddSampleWorkItem from './AddSampleWorkItem';

const UpdateWorkExamples = () => {
    const refRBSheet = useRef();

    return (
        <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XLARGE}>
            <TemplateBox selfCenter>
                <TemplateText
                    size={16}
                    startCase
                    bold
                >
                    Upload your sample photos
                </TemplateText>
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
                        height: 800,
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
                                size={16}
                                color={BLACK}
                                center
                            >
                                Upload sample photos
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={12}
                                color={BLACK}
                                center
                            >
                                You can upload up to 4 variants of
                                your links to your sample photos on your social media
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox pAll={WRAPPER_MARGIN}>

                            <AddSampleWorkItem
                                onClose={() => refRBSheet.current.close()}
                                style={styles.addButton}
                                type="photo"
                            />

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
