import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import useMailCompose from '../../../../hooks/documents/useMailCompose';
import useNotifications from '../../../../hooks/notifications/useNotifications';

const useProjectStatus = (
    application,
    creatorID,
    currentProject,
    creatorEmail,
    creatorFCMToken,
) => {
    const [currentStatusIndex, setCurrentStatusIndex] = useState();

    const { sendNotification } = useNotifications();

    const overviewStatus = useMemo(() => {
        if (!application?.status) return [];

        return application?.status;
    }, [application?.status]);

    const { updateProjectStatus } = useProjectsContext();

    const { composeEmailWithAttachment, mailEvent, setMailEvent } = useMailCompose();

    useEffect(() => {
        if (mailEvent === 'sent') {
            Alert.alert(
                'Proposal Sent',
                'Please wait for the creator to approve your proposal',
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            await updateProjectStatus(
                                creatorID,
                                currentProject,
                                currentStatusIndex,
                            );
                            await sendNotification(
                                creatorFCMToken,
                                'Project Status Updated',
                                `The status of your project has been updated to ${overviewStatus?.[currentStatusIndex]?.name}`,
                                {
                                    type: 'project_status',
                                    projectID: currentProject?.id,
                                    applicationID: application?.id,
                                },
                            );
                            setMailEvent('');
                        },
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            );
        } else if (mailEvent === 'failed' || mailEvent === 'cancelled') {
            Alert.alert(
                'Proposal Not Sent',
                'Please try again',
                [
                    {
                        text: 'OK',
                        onPress: () => setMailEvent(''),
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            );
        }
    }, [mailEvent]);
    const handleOnPressStatus = (status, statusIndex) => {
        setCurrentStatusIndex(statusIndex);
        if (status.value === 'brand_approved_enrollment') {
            Alert.alert(
                "You'll be prompted to attach your contract",
                'Please attach your contract to continue',
                [
                    {
                        text: 'OK',
                        onPress: () => composeEmailWithAttachment(creatorEmail),
                        style: 'cancel',
                    },
                ],
                { cancelable: false },

            );
            return;
        }
        if (status.value === 'brand_proposal_submitted') {
            Alert.alert(
                'Update Required by Creator',
                'Please wait for the creator to update the status',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            );
            return;
        }

        if (status.status === 'active' && !!creatorID && currentProject) {
            Alert.alert(
                'Update Status',
                `Are you sure you want to update the status to ${overviewStatus?.[statusIndex + 1]?.name}?`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: async () => {
                            await updateProjectStatus(creatorID, currentProject, statusIndex);
                            await sendNotification(
                                creatorFCMToken,
                                'Project Status Updated',
                                `The status of your project has been updated to ${overviewStatus?.[statusIndex + 1]?.name}`,
                                {
                                    type: 'project_status',
                                    projectID: currentProject?.id,
                                    applicationID: application?.id,
                                },
                            );
                        },
                    },
                ],
                { cancelable: false },
            );
        }
    };

    const handleOnPressCreatorStatus = (status, statusIndex) => {
        setCurrentStatusIndex(statusIndex);
        if (status.value === 'brand_contract_received') {
            Alert.alert(
                "You'll be prompted to attach your signed contract",
                'Please attach your signed contract to continue',
                [
                    {
                        text: 'OK',
                        onPress: () => composeEmailWithAttachment(creatorEmail),
                        style: 'cancel',
                    },
                ],
                { cancelable: false },

            );
            return;
        }
        if (!!creatorID && currentProject) {
            Alert.alert(
                'Update Status',
                `Are you sure you want to update the status to ${overviewStatus?.[statusIndex + 1]?.name}?`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: async () => {
                            await updateProjectStatus(creatorID, currentProject, statusIndex);
                            await sendNotification(
                                creatorFCMToken,
                                'Project Status Updated',
                                `The status of your project has been updated to ${overviewStatus?.[statusIndex + 1]?.name}`,
                                {
                                    type: 'project_status',
                                    projectID: currentProject?.id,
                                    applicationID: application?.id,
                                },
                            );
                        },
                    },
                ],
                { cancelable: false },
            );
        }
    };

    return {
        overviewStatus,
        handleOnPressStatus,
        handleOnPressCreatorStatus,
    };
};

export default useProjectStatus;
