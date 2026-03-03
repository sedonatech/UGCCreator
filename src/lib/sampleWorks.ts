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
    FieldValue,
    Timestamp,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';
import { nanoid } from 'nanoid/non-secure';
import ImagePicker from 'react-native-image-crop-picker';
import { stat } from 'react-native-fs';
import { Alert } from 'react-native';
import i18n from '../i18n';
import { markReviewPromptEligibleForTrigger } from '../hooks/useAppReview';

export type SampleWork = {
    id?: string;
    ownerId: string;
    title: string;
    description: string;
    coverUrl: string;
    socialUrl?: string;
    isFeatured: boolean;
    showcaseOptIn: boolean;
    visibility: 'public' | 'private';
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    rand: number;
};

export async function pickCoverImage(): Promise<string | null> {
    try {
        const res = await ImagePicker.openPicker({
            width: 1080,
            height: 1080,
            cropping: true,
            compressImageQuality: 0.8,
            compressImageMaxWidth: 1080,
            compressImageMaxHeight: 1080,
            mediaType: 'photo',
            forceJpg: true,
        });

        if (!res?.path) return null;

        const fileStats = await stat(res.path);
        const fileSizeInMB = fileStats.size / (1024 * 1024);

        if (fileSizeInMB > 3) {
            Alert.alert(i18n.t('common.alerts.imageTooLarge.title'), i18n.t('common.alerts.imageTooLarge.message'));
            return null;
        }

        return res.path;
    } catch (err) {
        console.log('Image picker cancelled', err);
        return null;
    }
}

// --- Upload cover to Storage ---
export async function uploadCover(uri: string, ownerId: string, sampleId?: string): Promise<string> {
    const id = sampleId || nanoid();
    const ref = storage().ref(`sampleWorks/${ownerId}/${id}.jpg`);
    await ref.putFile(uri, { contentType: 'image/jpeg' });
    return await ref.getDownloadURL();
}

// --- Create a sample ---
export async function createSample(input: Omit<SampleWork, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = getFirestore();
    const col = collection(db, 'sampleWorks');
    const now = serverTimestamp();
    const docRef = await addDoc(col, {
        ...input,
        createdAt: now,
        updatedAt: now,
    });

    // log analytics
    await analytics().logEvent('sample_created', {
        ownerId: input.ownerId,
        title: input.title,
        isFeatured: input.isFeatured,
        showcaseOptIn: input.showcaseOptIn,
        visibility: input.visibility,
    });
    await markReviewPromptEligibleForTrigger('creator_sample_work_added');

    return docRef;
}

// --- Update a sample ---
export async function updateSample(id: string, patch: Partial<SampleWork>) {
    const db = getFirestore();
    const sampleRef = doc(db, 'sampleWorks', id);
    await updateDoc(sampleRef, {
        ...patch,
        updatedAt: serverTimestamp(),
    });

    // log analytics
    await analytics().logEvent('sample_updated', {
        sampleId: id,
        ...patch,
    });
}

// --- Delete a sample ---
export async function deleteSample(id: string) {
    const db = getFirestore();
    const sampleRef = doc(db, 'sampleWorks', id);
    await deleteDoc(sampleRef);

    // log analytics
    await analytics().logEvent('sample_deleted', {
        sampleId: id,
    });
}

// --- Get user samples ---
export async function getMySamples(uid: string) {
    const db = getFirestore();
    const col = collection(db, 'sampleWorks');
    const q = query(col, where('ownerId', '==', uid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d: { id: any; data: () => SampleWork }) => ({ id: d.id, ...(d.data() as SampleWork) }));
}
