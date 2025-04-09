import React from 'react';
import PropTypes from 'prop-types';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateIcon from '../../../../components/TemplateIcon';
import LineSvg from '../../../../../assets/svgs/LineSvg';
import {
    BLACK,
    BRAND_BLUE, ERROR_RED, GREEN, GREY_30, GREY_SECONDARY, WHITE,
} from '../../../../theme/Colors';
import TemplateText from '../../../../components/TemplateText';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import useProjectStatus from '../hooks/useProjectStatus';

const CreatorProjectStatusOverviewTab = ({
    application, creatorID, currentProject, creatorEmail, creatorFCMToken,
}) => {
    const { overviewStatus, handleOnPressStatus } = useProjectStatus(
        application,
        creatorID,
        currentProject,
        creatorEmail,
        creatorFCMToken,
    );


    return (
        <TemplateBox ph={WRAPPER_MARGIN} mt={WRAPPER_MARGIN} mb={WRAPPER_MARGIN * 2}>
            {overviewStatus?.map((status, index) => {
                const isProjectCompleted = overviewStatus?.[overviewStatus?.length - 2]?.status === 'completed';
                const isActive = status.status === 'active';

                return (
                    <TemplateBox row key={status.value}>
                        <TemplateBox alignItems="center">
                            <TemplateBox
                                pAll={4}
                                borderRadius={20}
                                backgroundColor={
                                // eslint-disable-next-line no-nested-ternary
                                    (status.status === 'completed' || isProjectCompleted)
                                        ? GREEN : isActive ? BRAND_BLUE : status.status === 'rejected' ? ERROR_RED : GREY_SECONDARY
                                }
                            >
                                <TemplateIcon name="checkmark-circle-outline" color={WHITE} size={20} />
                            </TemplateBox>
                            {
                                index !== overviewStatus.length - 1 && (
                                // @ts-ignore
                                    <LineSvg
                                        color={
                                        // eslint-disable-next-line no-nested-ternary
                                            status.status === 'completed'
                                                ? GREEN : isActive ? BRAND_BLUE : GREY_SECONDARY
                                        }
                                    />
                                )
                            }
                        </TemplateBox>

                        <TemplateBox
                            borderRadius={10}
                            pAll={10}
                            backgroundColor={GREY_30}
                            width={SCREEN_WIDTH / 1.3}
                            mt={-18.4}
                            ml={10}
                            opacity={status.status === 'completed' ? 1 : isActive ? 1 : 0.4}
                            onPress={() => isActive && !isProjectCompleted && handleOnPressStatus(status, index)}
                        >
                            <TemplateText bold size={16} color={BLACK}>
                                {status?.brandName}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText size={12} color={BLACK}>
                                {status?.brandDescription}
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>
                );
            })}
        </TemplateBox>
    );
};

CreatorProjectStatusOverviewTab.propTypes = {
    application: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        creatorId: PropTypes.string,
        status: PropTypes.shape({
            current: {
                name: PropTypes.string,
                description: PropTypes.string,
                status: PropTypes.string,
            },
            next: {
                name: PropTypes.string,
                description: PropTypes.string,
                status: PropTypes.string,
            },
        }),
        enrolledAt: PropTypes.string,
        documents: PropTypes.arrayOf(PropTypes.string),
    })),
    creatorID: PropTypes.string,
    currentProject: PropTypes.shape(),
    creatorEmail: PropTypes.string,
    creatorFCMToken: PropTypes.string,
};

CreatorProjectStatusOverviewTab.defaultProps = {
    application: [],
    creatorID: '',
    currentProject: {},
    creatorEmail: '',
    creatorFCMToken: '',
};
export default CreatorProjectStatusOverviewTab;
