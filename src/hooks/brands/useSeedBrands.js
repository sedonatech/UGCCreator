import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, doc, writeBatch, serverTimestamp, getDocs, limit, query } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import platformBrands from '../../../config/defaultFeatures/defaults/platformBrands.json';

const SEED_KEY = '@brands_seeded_v4';
const BRANDS_COLLECTION = 'brands';
const BATCH_SIZE = 450;

/**
 * One-time seeder: writes platformBrands.json into Firestore `brands` collection.
 * Waits for Firebase Auth before writing (rules require auth != null).
 * Only includes translation fields when they have actual values.
 */
const useSeedBrands = () => {
    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
            if (!user) return;

            try {
                const alreadySeeded = await AsyncStorage.getItem(SEED_KEY);
                if (alreadySeeded === 'true') return;

                const db = getFirestore();

                const existing = await getDocs(query(collection(db, BRANDS_COLLECTION), limit(1)));
                if (!existing.empty) {
                    await AsyncStorage.setItem(SEED_KEY, 'true');
                    return;
                }

                const brands = platformBrands.brands || [];
                if (!brands.length) return;

                console.log(`[useSeedBrands] Seeding ${brands.length} brands to Firestore...`);

                let batch = writeBatch(db);
                let batchCount = 0;
                let totalWritten = 0;

                for (let i = 0; i < brands.length; i++) {
                    const b = brands[i];
                    const ref = doc(collection(db, BRANDS_COLLECTION));

                    // Build doc — only include translation fields with actual content
                    const brandDoc = {
                        name: (b.name || '').trim(),
                        email: (b.email || '').trim(),
                        link: (b.link || '').trim(),
                        category: (b.category || '').trim(),
                        description: (b.description || '').trim(),
                        isActive: true,
                        isBlocked: false,
                        source: 'migration',
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    };

                    if (b.description_es) brandDoc.description_es = b.description_es;
                    if (b.description_fr) brandDoc.description_fr = b.description_fr;
                    if (b.description_de) brandDoc.description_de = b.description_de;
                    if (b.description_pt_BR) brandDoc.description_pt_BR = b.description_pt_BR;
                    if (b.description_pt_PT) brandDoc.description_pt_PT = b.description_pt_PT;

                    batch.set(ref, brandDoc);
                    batchCount++;

                    if (batchCount >= BATCH_SIZE || i === brands.length - 1) {
                        await batch.commit();
                        totalWritten += batchCount;
                        batch = writeBatch(db);
                        batchCount = 0;
                    }
                }

                await AsyncStorage.setItem(SEED_KEY, 'true');
                console.log(`[useSeedBrands] ✅ Seeded ${totalWritten} brands to Firestore.`);
            } catch (e) {
                console.log('[useSeedBrands] ❌ Error seeding brands:', e);
            }
        });

        return () => unsubscribe();
    }, []);
};

export default useSeedBrands;
