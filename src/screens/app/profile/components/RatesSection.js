import React from 'react';
import PropTypes from 'prop-types';

import TemplateBox from '../../../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import {
    BLACK, BLACK_20, BRAND_BLUE,
} from '../../../../theme/Colors';

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
            shadow
        >
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Monthly Package</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox selfCenter>
                {
                    rates?.monthlyPackage?.map(({ title, description, price }, index) => (
                        <TemplateBox key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={5} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            {
                                index !== rates?.monthlyPackage?.length - 1 && (
                                    <TemplateBox
                                        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 4)}
                                        height={1}
                                        backgroundColor={BLACK_20}
                                        mv={20}
                                    />
                                )
                            }
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
            shadow
        >
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Video Starting Rates</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox selfCenter>
                {
                    rates?.videoStartingRate?.map(({ title, description, price }, index) => (
                        <TemplateBox key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={5} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            {
                                index !== rates?.videoStartingRate?.length - 1 && (
                                    <TemplateBox
                                        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 4)}
                                        height={1}
                                        backgroundColor={BLACK_20}
                                        mv={20}
                                    />
                                )
                            }
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
            shadow
        >
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Photo Starting Rates</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox selfCenter>
                {
                    rates?.photoStartingRate?.map(({ title, description, price }, index) => (
                        <TemplateBox key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={5} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            {
                                index !== rates?.photoStartingRate?.length - 1 && (
                                    <TemplateBox
                                        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 4)}
                                        height={1}
                                        backgroundColor={BLACK_20}
                                        mv={20}
                                    />
                                )
                            }
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
            shadow
        >
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Revisions</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox selfCenter>
                {
                    rates?.revision?.map(({ title, description, price }, index) => (
                        <TemplateBox key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={5} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            {
                                index !== rates?.revision?.length - 1 && (
                                    <TemplateBox
                                        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 4)}
                                        height={1}
                                        backgroundColor={BLACK_20}
                                        mv={20}
                                    />
                                )
                            }
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
            shadow
        >
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Usage Rights</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox selfCenter>
                {
                    rates?.usageRights?.map(({ title, description, price }, index) => (
                        <TemplateBox key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={5} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            {
                                index !== rates?.usageRights?.length - 1 && (
                                    <TemplateBox
                                        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 4)}
                                        height={1}
                                        backgroundColor={BLACK_20}
                                        mv={20}
                                    />
                                )
                            }
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
            shadow
        >
            <TemplateBox selfCenter>
                <TemplateText bold size={20} color={BLACK}>Exclusive Rights</TemplateText>
            </TemplateBox>
            <TemplateBox height={WRAPPER_MARGIN} />
            <TemplateBox selfCenter>
                {
                    rates?.exclusiveRights?.map(({ title, description, price }, index) => (
                        <TemplateBox key={title}>
                            <TemplateText bold size={18} color={BLACK}>{title}</TemplateText>
                            <TemplateBox height={5} />
                            <TemplateText
                                size={14}
                                color={BLACK}
                            >
                                {description}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText bold size={16} color={BLACK}>{`€${price}`}</TemplateText>
                            {
                                index !== rates?.exclusiveRights?.length - 1 && (
                                    <TemplateBox
                                        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 4)}
                                        height={1}
                                        backgroundColor={BLACK_20}
                                        mv={20}
                                    />
                                )
                            }
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
            price: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })),
        videoStartingRate: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })),
        photoStartingRate: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })),
        revision: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })),
        usageRights: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        })),
        exclusiveRights: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            price: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
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
