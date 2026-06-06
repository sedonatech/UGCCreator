import {
    getFirestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from '@react-native-firebase/firestore';
import { scheduleFollowUpNotification, cancelFollowUpNotification } from './brandApplicationNotifications';

export type ApplicationStatus = 'applied' | 'heard_back' | 'accepted' | 'rejected';

export type BrandApplication = {
    id?: string;
    ownerId: string;
    brandName: string;
    /** Brand contact email — required for the auto follow-up sequence (Smart Sequence) */
    brandEmail?: string;
    link: string;
    status: ApplicationStatus;
    notes?: string;
    appliedAt?: Timestamp;
    updatedAt?: Timestamp;
    nextFollowUp?: Timestamp;
    /**
     * Smart Sequence step counter for auto follow-up emails.
     * 0 = initial email sent (manual), J+3 follow-up not yet sent
     * 1 = J+3 follow-up sent, J+7 follow-up not yet sent
     * 2 = J+7 follow-up sent, sequence complete
     */
    sequenceStep?: number;
    /** Timestamp of last auto follow-up email sent by Cloud Function */
    lastFollowUpSentAt?: Timestamp;
};

const COLLECTION = 'brandApplications';

export async function createBrandApplication(
    input: Omit<BrandApplication, 'id' | 'appliedAt' | 'updatedAt' | 'nextFollowUp'>,
) {
    const db = getFirestore();
    const col = collection(db, COLLECTION);

    // Prevent duplicates: same owner + same link
    const dupeQuery = query(col, where('ownerId', '==', input.ownerId), where('link', '==', input.link));
    const existing = await getDocs(dupeQuery);
    if (!existing.empty) {
        throw new Error('You have already tracked this brand.');
    }

    const now = serverTimestamp();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const followUpDate = new Date(Date.now() + threeDaysMs);
    const ref = await addDoc(col, {
        ...input,
        appliedAt: now,
        updatedAt: now,
        nextFollowUp: Timestamp.fromMillis(followUpDate.getTime()),
        sequenceStep: 0,
    });

    await scheduleFollowUpNotification(ref.id, input.brandName, followUpDate);

    return ref;
}

export async function updateBrandApplication(id: string, patch: Partial<BrandApplication>) {
    const db = getFirestore();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
    const db = getFirestore();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { status, updatedAt: serverTimestamp() });

    // Stop reminders for terminal statuses
    if (status === 'accepted' || status === 'rejected') {
        await cancelFollowUpNotification(id);
    }
}

export async function deleteBrandApplication(id: string) {
    const db = getFirestore();
    const ref = doc(db, COLLECTION, id);
    await cancelFollowUpNotification(id);
    await deleteDoc(ref);
}

export async function snoozeFollowUp(id: string, brandName: string, days: number = 3) {
    const db = getFirestore();
    const ref = doc(db, COLLECTION, id);
    const followUpDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const nextFollowUp = Timestamp.fromMillis(followUpDate.getTime());
    await updateDoc(ref, { nextFollowUp, updatedAt: serverTimestamp() });
    await scheduleFollowUpNotification(id, brandName, followUpDate);
}

export async function getMyBrandApplications(uid: string): Promise<BrandApplication[]> {
    const db = getFirestore();
    const col = collection(db, COLLECTION);
    const q = query(col, where('ownerId', '==', uid), orderBy('appliedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d: { id: any; data: () => BrandApplication }) => ({
        id: d.id,
        ...(d.data() as BrandApplication),
    }));
}
