import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import ProfileStatusCard from '../../../../components/cards/ProfileStatusCard';

const NO_CURRENT_NOTIFICATIONS_MESSAGE = 'You have no current notifications';
const NO_CURRENT_NOTIFICATIONS_TITLE = 'No Notifications';
const ProjectNotificationsTab: FC = () => (
    <TemplateBox ph={WRAPPER_MARGIN} pt={WRAPPER_MARGIN}>
        {/* @ts-ignore */}
        <ProfileStatusCard
            title={NO_CURRENT_NOTIFICATIONS_TITLE}
            description={NO_CURRENT_NOTIFICATIONS_MESSAGE}
            showProgress={false}
            style={styles.statusCard}
            slideInDelay={200}
            showIcon={false}
        />
    </TemplateBox>
);

const styles = StyleSheet.create({
    statusCard: {
        marginBottom: WRAPPER_MARGIN * 2
    }
});
export default ProjectNotificationsTab;
