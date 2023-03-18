import React from 'react';
import PropTypes from 'prop-types';

import TemplateBox from '../../../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import {
    BLACK, BLACK_40, BRAND_BLUE, LAVENDER,
} from '../../../../theme/Colors';
import Blob from '../../../../../assets/svgs/Blob';

const RatesSection = ({ rates }) => (
    <TemplateBox mh={WRAPPER_MARGIN} mt={WRAPPER_MARGIN * 2}>
        <TemplateText bold color={BLACK} size={18}>My Current Rates</TemplateText>
        <TemplateBox height={10} />

        <TemplateBox
            pAll={WRAPPER_MARGIN}
            backgroundColor={BRAND_BLUE}
            borderRadius={10}
            width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
            justifyContent="center"
        >
            <Blob color={LAVENDER} />
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Monthly Package</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox row selfCenter justifyContent="space-between">
                {
                    rates?.monthlyPackage?.map(({ title, description, price }) => (
                        <TemplateBox width={SCREEN_WIDTH / 4.2} ml={14} key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                        </TemplateBox>
                    ))
                }

            </TemplateBox>
        </TemplateBox>

        <TemplateBox height={WRAPPER_MARGIN} />
        <TemplateBox
            pAll={WRAPPER_MARGIN}
            backgroundColor={BRAND_BLUE}
            borderRadius={10}
            width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
            justifyContent="center"
        >
            <Blob color={LAVENDER} />
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Video Starting Rates</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox row selfCenter justifyContent="space-between">
                {
                    rates?.videoStartingRate?.map(({ title, description, price }) => (
                        <TemplateBox width={SCREEN_WIDTH / 4.2} ml={14} key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                        </TemplateBox>
                    ))
                }

            </TemplateBox>
        </TemplateBox>

        <TemplateBox height={WRAPPER_MARGIN} />
        <TemplateBox
            pAll={WRAPPER_MARGIN}
            backgroundColor={BRAND_BLUE}
            borderRadius={10}
            width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
            justifyContent="center"
        >
            <Blob color={LAVENDER} />
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Photo Starting Rates</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox row selfCenter justifyContent="space-between">
                {
                    rates?.photoStartingRate?.map(({ title, description, price }) => (
                        <TemplateBox width={SCREEN_WIDTH / 4.2} ml={14} key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                        </TemplateBox>
                    ))
                }

            </TemplateBox>
        </TemplateBox>

        <TemplateBox height={WRAPPER_MARGIN} />
        <TemplateBox
            pAll={WRAPPER_MARGIN}
            backgroundColor={BRAND_BLUE}
            borderRadius={10}
            width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
            justifyContent="center"
        >
            <Blob color={LAVENDER} />
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Revisions</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox row selfCenter justifyContent="space-between">
                {
                    rates?.revision?.map(({ title, description, price }) => (
                        <TemplateBox width={SCREEN_WIDTH / 4.2} ml={14} key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                        </TemplateBox>
                    ))
                }

            </TemplateBox>
        </TemplateBox>
        <TemplateBox height={WRAPPER_MARGIN} />
        <TemplateBox
            pAll={WRAPPER_MARGIN}
            backgroundColor={BRAND_BLUE}
            borderRadius={10}
            width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}
            justifyContent="center"
        >
            <Blob color={LAVENDER} />
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Usage Rights</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox row selfCenter justifyContent="space-between">
                {
                    rates?.usageRights?.map(({ title, description, price }) => (
                        <TemplateBox width={SCREEN_WIDTH / 4.2} ml={14} key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                        </TemplateBox>
                    ))
                }

            </TemplateBox>
        </TemplateBox>

        <TemplateBox height={WRAPPER_MARGIN} />
        <TemplateBox
            pAll={WRAPPER_MARGIN}
            backgroundColor={BRAND_BLUE}
            borderRadius={10}
            width={SCREEN_WIDTH - (WRAPPER_MARGIN * 2)}

        >
            <Blob color={LAVENDER} />
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Exclusive Rights</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox row selfCenter justifyContent="space-between">
                {
                    rates?.exclusiveRights?.map(({ title, description, price }) => (
                        <TemplateBox width={SCREEN_WIDTH / 4.2} ml={14} key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                        </TemplateBox>
                    ))
                }
            </TemplateBox>
        </TemplateBox>
    </TemplateBox>
);

RatesSection.propTypes = {
    rates: PropTypes.shape({
        monthlyPackage: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.number,
        })),
        videoStartingRate: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.number,
        })),
        photoStartingRate: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.number,
        })),
        revision: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.number,
        })),
        usageRights: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.number,
        })),
        exclusiveRights: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.number,
        })),
    }),
};

RatesSection.defaultProps = {
    rates: {
        videoStartingRate: [],
        photoStartingRate: [],
        revision: [],
        usageRights: [],
        exclusiveRights: [],
    },
};
export default RatesSection;
