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

export type ApplicationStatus = 'applied' | 'heard_back' | 'accepted' | 'rejected';

export type BrandApplication = {
    id?: string;
    ownerId: string;
    brandName: string;
    link: string;
    status: ApplicationStatus;
    notes?: string;
    appliedAt?: Timestamp;
    updatedAt?: Timestamp;
    nextFollowUp?: Timestamp;
};

const COLLECTION = 'brandApplications';

export async function createBrandApplication(
    input: Omit<BrandApplication, 'id' | 'appliedAt' | 'updatedAt' | 'nextFollowUp'>,
) {
    const db = getFirestore();
    const col = collection(db, COLLECTION);

    // Prevent duplicates: same owner + same link
    const dupeQuery = query(
        col,
        where('ownerId', '==', input.ownerId),
        where('link', '==', input.link),
    );
    const existing = await getDocs(dupeQuery);
    if (!existing.empty) {
        throw new Error('You have already tracked this brand.');
    }

    const now = serverTimestamp();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    return addDoc(col, {
        ...input,
        appliedAt: now,
        updatedAt: now,
        nextFollowUp: Timestamp.fromMillis(Date.now() + threeDaysMs),
    });
}

export async function updateBrandApplication(id: string, patch: Partial<BrandApplication>) {
    const db = getFirestore();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteBrandApplication(id: string) {
    const db = getFirestore();
    const ref = doc(db, COLLECTION, id);
    await deleteDoc(ref);
}

export async function snoozeFollowUp(id: string, days: number = 3) {
    const db = getFirestore();
    const ref = doc(db, COLLECTION, id);
    const nextFollowUp = Timestamp.fromMillis(Date.now() + days * 24 * 60 * 60 * 1000);
    await updateDoc(ref, { nextFollowUp, updatedAt: serverTimestamp() });
}

export async function getMyBrandApplications(uid: string): Promise<BrandApplication[]> {
    const db = getFirestore();
    const col = collection(db, COLLECTION);
    const q = query(col, where('ownerId', '==', uid), orderBy('appliedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as BrandApplication) }));
}
