/**
 * Migration Script: Seed Firestore `brands` collection
 * from platformBrands.json (identical to carouselBrands.json).
 *
 * Usage:
 *   1. Make sure you're logged into Firebase CLI: `firebase login`
 *   2. Run: FIREBASE_PROJECT_ID=your-project-id node scripts/migrateBrandsToFirestore.js
 *
 * Or with a service account key:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json \
 *   FIREBASE_PROJECT_ID=your-project-id \
 *   node scripts/migrateBrandsToFirestore.js
 *
 * Collection created:
 *   - `brands` — unified flat list of every brand (261 brands)
 *
 * Safe to re-run: uses deterministic document IDs based on brand name.
 */

const admin = require('firebase-admin');
const path = require('path');

// ── Initialise Admin SDK ───────────────────────────────────────────────
admin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

// ── Load JSON source ───────────────────────────────────────────────────
const platformBrands = require(path.resolve(__dirname, '../config/defaultFeatures/defaults/platformBrands.json'));

// ── Helpers ────────────────────────────────────────────────────────────

/** Create a URL-safe, deterministic document ID from a brand name. */
function toDocId(name) {
    return (name || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function now() {
    return admin.firestore.FieldValue.serverTimestamp();
}

// ── Build brand documents ──────────────────────────────────────────────

const brands = platformBrands.brands.map((b) => ({
    docId: toDocId(b.name),
    name: (b.name || '').trim(),
    email: (b.email || '').trim(),
    link: (b.link || '').trim(),
    category: (b.category || '').trim(),
    description: (b.description || '').trim(),
    description_es: b.description_es || '',
    description_fr: b.description_fr || '',
    description_de: b.description_de || '',
    description_pt_BR: b.description_pt_BR || '',
    description_pt_PT: b.description_pt_PT || '',
    isActive: true,
    isBlocked: false,
    source: 'migration',
    createdAt: now(),
    updatedAt: now(),
}));

console.log(`Prepared ${brands.length} brands for migration.\n`);

// ── Write to Firestore ─────────────────────────────────────────────────

async function migrate() {
    const BATCH_LIMIT = 450;
    let batch = db.batch();
    let opCount = 0;

    for (const brand of brands) {
        const { docId, ...data } = brand;
        const ref = db.collection('brands').doc(docId);
        batch.set(ref, data, { merge: true });
        opCount++;

        if (opCount >= BATCH_LIMIT) {
            await batch.commit();
            console.log(`  Committed batch of ${opCount} operations`);
            batch = db.batch();
            opCount = 0;
        }
    }

    if (opCount > 0) {
        await batch.commit();
        console.log(`  Committed final batch of ${opCount} operations`);
    }

    console.log(`\n✅ Migration complete! ${brands.length} brands written to Firestore 'brands' collection.`);
}

migrate()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
