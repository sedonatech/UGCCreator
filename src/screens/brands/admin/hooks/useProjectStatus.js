import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import useProjectsContext from '../../../../hooks/brands/useProjectsContext';
import useMailCompose from '../../../../hooks/documents/useMailCompose';
import useNotifications from '../../../../hooks/notifications/useNotifications';

const useProjectStatus = (application, creatorID, currentProject, creatorEmail, creatorFCMToken) => {
    const { t } = useTranslation();
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
                t('projects.status.alerts.proposalSent.title'),
                t('projects.status.alerts.proposalSent.message'),
                [
                    {
                        text: t('common.buttons.ok'),
                        onPress: async () => {
                            await updateProjectStatus(creatorID, currentProject, currentStatusIndex);
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
                t('projects.status.alerts.proposalNotSent.title'),
                t('projects.status.alerts.proposalNotSent.message'),
                [
                    {
                        text: t('common.buttons.ok'),
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
                t('projects.status.alerts.attachContract.title'),
                t('projects.status.alerts.attachContract.message'),
                [
                    {
                        text: t('common.buttons.ok'),
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
                t('projects.status.alerts.updateRequired.title'),
                t('projects.status.alerts.updateRequired.message'),
                [
                    {
                        text: t('common.buttons.ok'),
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
                t('projects.status.alerts.updateStatus.title'),
                t('projects.status.alerts.updateStatus.message', { status: overviewStatus?.[statusIndex + 1]?.name }),
                [
                    {
                        text: t('common.actions.cancel'),
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: t('common.buttons.ok'),
                        onPress: async () => {
                            await updateProjectStatus(creatorID, currentProject, statusIndex);
                            await sendNotification(
                                creatorFCMToken,
                                'Project Status Updated',
                                `The status of your project has been updated to ${
                                    overviewStatus?.[statusIndex + 1]?.name
                                }`,
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
                t('projects.status.alerts.attachSignedContract.title'),
                t('projects.status.alerts.attachSignedContract.message'),
                [
                    {
                        text: t('common.buttons.ok'),
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
                t('projects.status.alerts.updateStatus.title'),
                t('projects.status.alerts.updateStatus.message', { status: overviewStatus?.[statusIndex + 1]?.name }),
                [
                    {
                        text: t('common.actions.cancel'),
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: t('common.buttons.ok'),
                        onPress: async () => {
                            await updateProjectStatus(creatorID, currentProject, statusIndex);
                            await sendNotification(
                                creatorFCMToken,
                                'Project Status Updated',
                                `The status of your project has been updated to ${
                                    overviewStatus?.[statusIndex + 1]?.name
                                }`,
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
