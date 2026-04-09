import { useEffect, useState, useCallback } from 'react';
import {
    getFirestore,
    collection,
    query,
    getDocs,
    limit as fsLimit,
} from '@react-native-firebase/firestore';

const BRANDS_COLLECTION = 'brands';

/**
 * Fetches brands from the Firestore `brands` collection.
 * Filters for active/non-blocked and sorts by name client-side
 * to avoid needing composite indexes.
 *
 * @param {Object} options
 * @param {number} [options.limit] - Max brands to fetch (default 300)
 * @param {string} [options.category] - Filter by category (client-side)
 * @returns {{ brands, loading, error, refresh, loadMore }}
 */
const useBrands = ({ limit = 300, category } = {}) => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBrands = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const db = getFirestore();

            const q = query(
                collection(db, BRANDS_COLLECTION),
                fsLimit(limit),
            );

            const snapshot = await getDocs(q);
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Filter and sort client-side to avoid composite index requirement
            let filtered = fetched.filter(b => b.isActive !== false && !b.isBlocked);

            if (category) {
                filtered = filtered.filter(b => b.category === category);
            }

            filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

            setBrands(filtered);
        } catch (e) {
            console.log('[useBrands] Error fetching brands:', e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [limit, category]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const refresh = useCallback(() => {
        fetchBrands();
    }, [fetchBrands]);

    return { brands, loading, error, refresh };
};

export default useBrands;
