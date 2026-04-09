import notifee, {
    TimestampTrigger,
    TriggerType,
    AndroidImportance,
    AuthorizationStatus,
    EventType,
} from '@notifee/react-native';

const CHANNEL_ID = 'brand-applications';
const FOLLOW_UP_PREFIX = 'follow-up-';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

async function ensureChannel() {
    await notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Brand Applications',
        importance: AndroidImportance.HIGH,
    });
}

async function ensurePermissions(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
}

export async function scheduleFollowUpNotification(
    applicationId: string,
    brandName: string,
    followUpDate: Date,
) {
    const hasPermission = await ensurePermissions();
    if (!hasPermission) return;

    await ensureChannel();

    // Cancel any existing notification for this application before scheduling a new one
    await notifee.cancelNotification(`${FOLLOW_UP_PREFIX}${applicationId}`);

    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: followUpDate.getTime(),
        alarmManager: {
            allowWhileIdle: true,
        },
    };

    await notifee.createTriggerNotification(
        {
            id: `${FOLLOW_UP_PREFIX}${applicationId}`,
            title: 'Time to Follow Up!',
            body: `Don't forget to follow up with ${brandName} about your application.`,
            data: {
                applicationId,
                brandName,
            },
            android: {
                channelId: CHANNEL_ID,
                pressAction: { id: 'default' },
                importance: AndroidImportance.HIGH,
            },
            ios: {
                sound: 'default',
            },
        },
        trigger,
    );
}

export async function cancelFollowUpNotification(applicationId: string) {
    await notifee.cancelNotification(`${FOLLOW_UP_PREFIX}${applicationId}`);
}

/**
 * Call this once at app startup (e.g. in App.tsx or MainNavigator).
 * When a follow-up notification is delivered, it automatically schedules the next one in 3 days.
 */
export function setupFollowUpAutoRepeat() {
    notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.DELIVERED && detail.notification?.id?.startsWith(FOLLOW_UP_PREFIX)) {
            const { applicationId, brandName } = detail.notification.data ?? {};
            if (applicationId && brandName) {
                const nextDate = new Date(Date.now() + THREE_DAYS_MS);
                scheduleFollowUpNotification(applicationId as string, brandName as string, nextDate);
            }
        }
        // Note: PRESS events for foreground are handled in useNotificationInteraction.js
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.DELIVERED && detail.notification?.id?.startsWith(FOLLOW_UP_PREFIX)) {
            const { applicationId, brandName } = detail.notification.data ?? {};
            if (applicationId && brandName) {
                const nextDate = new Date(Date.now() + THREE_DAYS_MS);
                await scheduleFollowUpNotification(applicationId as string, brandName as string, nextDate);
            }
        }
        // PRESS events in the background are handled when the app resumes via
        // notifee.getInitialNotification() in useNotificationInteraction.js
    });
}
