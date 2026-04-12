import React, { useRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';

import { ScrollView } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import { IS_ANDROID, SCREEN_WIDTH, SPACE_XLARGE, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import AddButtonLargeSvg from '../../../../../assets/svgs/AddButtonLargeSvg';
import { BLACK, IOS_BLUE, WHITE, WHITE_96 } from '../../../../theme/Colors';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import RateItem from './RateItem';

const UpdateRates = () => {
    const refRBSheet = useRef();
    const { auth } = useAuthContext();

    const { profile: profileData, update } = auth;

    const handleUpdate = () => {
        refRBSheet.current.close();
    };

    return (
        <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XLARGE}>
            <TemplateBox selfCenter>
                <TemplateText size={16} startCase bold>
                    Update your rates
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
                    <TemplateBox ml={SCREEN_WIDTH - WRAPPER_MARGIN * 4} onPress={handleUpdate}>
                        <TemplateText size={16} color={IOS_BLUE} bold>
                            Update
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox mb={WRAPPER_MARGIN}>
                        <TemplateBox selfCenter mt={WRAPPER_MARGIN}>
                            <TemplateText bold size={18} color={BLACK} center startCase>
                                Monthly Package
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox height={10} />
                        {profileData?.rates?.monthlyPackage?.map((item, index) => (
                            <RateItem
                                key={`${item.title}-${index}`}
                                title={item?.title}
                                description={item?.description}
                                value={item?.price}
                                onChangeText={text => {
                                    const updated = profileData?.rates?.monthlyPackage?.map((r, i) =>
                                        i === index ? { ...r, price: text } : r,
                                    );
                                    if (updated) update('rates.monthlyPackage', updated);
                                }}
                            />
                        ))}
                    </TemplateBox>

                    <TemplateBox mb={WRAPPER_MARGIN}>
                        <TemplateBox selfCenter mt={WRAPPER_MARGIN}>
                            <TemplateText bold size={18} color={BLACK} center startCase>
                                Video Starting Rate
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox height={10} />
                        {profileData?.rates?.videoStartingRate?.map((item, index) => (
                            <RateItem
                                key={`${item.title}-${index}`}
                                title={item?.title}
                                description={item?.description}
                                value={item?.price}
                                onChangeText={text => {
                                    const updated = profileData?.rates?.videoStartingRate?.map((r, i) =>
                                        i === index ? { ...r, price: text } : r,
                                    );
                                    if (updated) update('rates.videoStartingRate', updated);
                                }}
                            />
                        ))}
                    </TemplateBox>

                    <TemplateBox mb={WRAPPER_MARGIN}>
                        <TemplateBox selfCenter mt={WRAPPER_MARGIN}>
                            <TemplateText bold size={18} color={BLACK} center>
                                Photo Starting Rate
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox height={10} />
                        {profileData?.rates?.photoStartingRate?.map((item, index) => (
                            <RateItem
                                key={`${item.title}-${index}`}
                                title={item?.title}
                                description={item?.description}
                                value={item?.price}
                                onChangeText={text => {
                                    const updated = profileData?.rates?.photoStartingRate?.map((r, i) =>
                                        i === index ? { ...r, price: text } : r,
                                    );
                                    if (updated) update('rates.photoStartingRate', updated);
                                }}
                            />
                        ))}
                    </TemplateBox>

                    <TemplateBox mb={WRAPPER_MARGIN}>
                        <TemplateBox selfCenter mt={WRAPPER_MARGIN}>
                            <TemplateText bold size={18} color={BLACK} center>
                                Revisions
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox height={10} />
                        {profileData?.rates?.revision?.map((item, index) => (
                            <RateItem
                                key={`${item.title}-${index}`}
                                title={item?.title}
                                description={item?.description}
                                value={item?.price}
                                onChangeText={text => {
                                    const updated = profileData?.rates?.revision?.map((r, i) =>
                                        i === index ? { ...r, price: text } : r,
                                    );
                                    if (updated) update('rates.revision', updated);
                                }}
                            />
                        ))}
                    </TemplateBox>

                    <TemplateBox mb={WRAPPER_MARGIN}>
                        <TemplateBox selfCenter mt={WRAPPER_MARGIN}>
                            <TemplateText bold size={18} color={BLACK} center>
                                Usage Rights
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox height={10} />
                        {profileData?.rates?.usageRights?.map((item, index) => (
                            <RateItem
                                key={`${item.title}-${index}`}
                                title={item?.title}
                                description={item?.description}
                                value={item?.price}
                                onChangeText={text => {
                                    const updated = profileData?.rates?.usageRights?.map((r, i) =>
                                        i === index ? { ...r, price: text } : r,
                                    );
                                    if (updated) update('rates.usageRights', updated);
                                }}
                            />
                        ))}
                    </TemplateBox>

                    <TemplateBox mb={WRAPPER_MARGIN}>
                        <TemplateBox selfCenter mt={WRAPPER_MARGIN}>
                            <TemplateText bold size={18} color={BLACK} center>
                                Exclusive Rights
                            </TemplateText>
                        </TemplateBox>
                        <TemplateBox height={10} />
                        {profileData?.rates?.exclusiveRights?.map((item, index) => (
                            <RateItem
                                key={`${item.title}-${index}`}
                                title={item?.title}
                                description={item?.description}
                                value={item?.price}
                                onChangeText={text => {
                                    const updated = profileData?.rates?.exclusiveRights?.map((r, i) =>
                                        i === index ? { ...r, price: text } : r,
                                    );
                                    if (updated) update('rates.exclusiveRights', updated);
                                }}
                            />
                        ))}
                    </TemplateBox>
                </ScrollView>
            </RBSheet>
        </TemplateBox>
    );
};

export default UpdateRates;
